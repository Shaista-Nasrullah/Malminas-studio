// FILE: lib/actions/order.actions.ts

"use server";

import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema, placeOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { Order, ShippingAddress } from "@/types"; // Import Order type
import { convertToPlainObject, formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/email";
import { cookies } from "next/headers";
import z from "zod";
import { postexFetch } from "@/lib/postex";

// FILE: lib/actions/order.actions.ts

// Retrieve the PostEx Pickup Address Code from environment variables
const POSTEX_PICKUP_ADDRESS_CODE = process.env.POSTEX_PICKUP_ADDRESS_CODE;
// You can add a check to ensure it's defined if you want to fail early
if (!POSTEX_PICKUP_ADDRESS_CODE) {
  console.warn(
    "WARNING: POSTEX_PICKUP_ADDRESS_CODE is not defined in environment variables. PostEx orders might fail."
  );
  // Optionally, you might want to throw an error here to prevent orders from being placed without it:
  // throw new Error("POSTEX_PICKUP_ADDRESS_CODE must be defined in your environment variables.");
}

export const placeOrder = async (
  formData: z.infer<typeof placeOrderSchema>
) => {
  try {
    let userId: string;
    const session = await auth();

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      const { email, fullName } = formData;
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: { email, name: fullName },
        });
        userId = newUser.id;
      }
    }

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      throw new Error(
        "Your cart is empty. Please add items before checking out."
      );
    }

    const orderDataToValidate = {
      userId,
      shippingAddress: {
        fullName: formData.fullName,
        streetAddress: formData.streetAddress,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode || "",
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    };

    const validatedOrder = insertOrderSchema.parse(orderDataToValidate);

    let postexTrackingNumber: string | null = null;
    try {
      // Only proceed with PostEx if the pickup address code is available
      if (POSTEX_PICKUP_ADDRESS_CODE) {
        const postexOrderPayload = {
          cityName: formData.city,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          deliveryAddress: `${formData.streetAddress}, ${formData.city}, ${formData.country} - ${formData.postalCode}`,
          invoiceDivision: 0,
          invoicePayment: parseFloat(validatedOrder.totalPrice.toString()),
          items: cart.items.reduce((sum, item) => sum + item.qty, 0),
          orderDetail: cart.items
            .map((item) => `${item.name} (Qty: ${item.qty})`)
            .join(", "),
          orderRefNumber: `YOUR_STORE_PREFIX-${Date.now()}-${userId.substring(
            0,
            5
          )}`,
          orderType: "Normal",
          transactionNotes: "E-commerce order via website",
          pickupAddressCode: POSTEX_PICKUP_ADDRESS_CODE, // <<<--- Using the env var here
          // If you have a storeAddressCode from PostEx, you can add it here too:
          // storeAddressCode: process.env.POSTEX_STORE_ADDRESS_CODE,
        };

        const postexResponse = await postexFetch<{
          statusCode: string;
          statusMessage: string;
          dist: {
            trackingNumber: string;
            orderStatus: string;
            orderDate: string;
          };
        }>("/v3/create-order", {
          method: "POST",
          body: JSON.stringify(postexOrderPayload),
        });

        if (postexResponse.statusCode === "200") {
          postexTrackingNumber = postexResponse.dist.trackingNumber;
          console.log("PostEx Order Created:", postexTrackingNumber);
        } else {
          console.error(
            "Failed to create PostEx order:",
            postexResponse.statusMessage
          );
        }
      } else {
        console.warn(
          "Skipping PostEx order creation because POSTEX_PICKUP_ADDRESS_CODE is not configured."
        );
      }
    } catch (postexError) {
      console.error("Error creating PostEx order:", postexError);
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...validatedOrder,
          postexTrackingNumber: postexTrackingNumber,
          orderitems: {
            create: cart.items.map((item) => ({
              name: item.name,
              slug: item.slug,
              qty: item.qty,
              image: item.image,
              price: item.price,
              productId: item.productId,
            })),
          },
        },
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          address: validatedOrder.shippingAddress,
          paymentMethod: validatedOrder.paymentMethod,
        },
      });
      await tx.cart.delete({ where: { id: cart.id } });
      return order;
    });

    try {
      const fullOrderForEmail = await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          user: { select: { name: true, email: true } },
          orderitems: true,
        },
      });

      if (fullOrderForEmail) {
        const formattedOrderForEmail: Order = {
          ...fullOrderForEmail,
          itemsPrice: fullOrderForEmail.itemsPrice.toString(),
          shippingPrice: fullOrderForEmail.shippingPrice.toString(),
          taxPrice: fullOrderForEmail.taxPrice.toString(),
          totalPrice: fullOrderForEmail.totalPrice.toString(),
          createdAt: fullOrderForEmail.createdAt.toISOString(),
          paidAt: fullOrderForEmail.paidAt
            ? fullOrderForEmail.paidAt.toISOString()
            : null,
          deliveredAt: fullOrderForEmail.deliveredAt
            ? fullOrderForEmail.deliveredAt.toISOString()
            : null,
          shippingAddress: fullOrderForEmail.shippingAddress as ShippingAddress,
          orderitems: fullOrderForEmail.orderitems.map((item) => ({
            ...item,
            price: item.price.toString(),
          })),
        };
        await sendPurchaseReceipt({ order: formattedOrderForEmail });
      } else {
        console.error(
          `Failed to fetch order details for email (ID: ${newOrder.id})`
        );
      }
    } catch (emailError) {
      console.error(
        `--- FAILED TO SEND PURCHASE RECEIPT EMAIL for order ${newOrder.id} ---`,
        emailError
      );
    }

    cookies().set("sessionCartId", "", { maxAge: -1 });
    revalidatePath("/my-orders");
    return {
      success: true,
      message: "Order has been created successfully.",
      redirectTo: `/order/${newOrder.id}`,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An unexpected error occurred.",
    };
  }
};

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authorized");

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export async function getOrderSummary() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/orders");
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!order) throw new Error("Order not found");
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date() },
    });
    const updatedOrderForEmail = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });
    if (!updatedOrderForEmail) {
      throw new Error("Failed to retrieve updated order details for email.");
    }
    const formattedOrder: Order = {
      ...updatedOrderForEmail,
      itemsPrice: updatedOrderForEmail.itemsPrice.toString(),
      shippingPrice: updatedOrderForEmail.shippingPrice.toString(),
      taxPrice: updatedOrderForEmail.taxPrice.toString(),
      totalPrice: updatedOrderForEmail.totalPrice.toString(),
      createdAt: updatedOrderForEmail.createdAt.toISOString(),
      paidAt: updatedOrderForEmail.paidAt
        ? updatedOrderForEmail.paidAt.toISOString()
        : null,
      deliveredAt: updatedOrderForEmail.deliveredAt
        ? updatedOrderForEmail.deliveredAt.toISOString()
        : null,
      shippingAddress: updatedOrderForEmail.shippingAddress as ShippingAddress,
      orderitems: updatedOrderForEmail.orderitems.map((item) => ({
        ...item,
        price: item.price.toString(),
      })),
    };
    sendPurchaseReceipt({
      order: formattedOrder,
    });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order has been marked paid" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");
    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order has been marked delivered" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
