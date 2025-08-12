// FILE: lib/actions/order.actions.ts

"use server";

import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema, placeOrderSchema } from "../validators"; // MODIFIED IMPORT
import { prisma } from "@/db/prisma";
import { ShippingAddress } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/email";
import { cookies } from "next/headers";
import z from "zod";

// --- DELETED: All local schema definitions have been removed ---

export const placeOrder = async (
  // MODIFIED: Use the new, imported schema for type inference
  formData: z.infer<typeof placeOrderSchema>
) => {
  try {
    let userId: string;
    const session = await auth();

    // --- 1. USER HANDLING ---
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      const { email, fullName } = formData;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return {
          success: false,
          message: "An account with this email already exists.",
          errorType: "ACCOUNT_EXISTS",
        };
      }
      const newUser = await prisma.user.create({
        data: { email, name: fullName },
      });
      userId = newUser.id;
    }

    // --- 2. CART HANDLING ---
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      throw new Error(
        "Your cart is empty. Please add items before checking out."
      );
    }

    // --- 3. VALIDATION & ORDER CREATION IN A TRANSACTION ---
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

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...validatedOrder,
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

    // --- SEND PURCHASE RECEIPT EMAIL ---
    try {
      const fullOrderForEmail = await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          user: { select: { name: true, email: true } },
          orderitems: true,
        },
      });

      if (fullOrderForEmail) {
        await sendPurchaseReceipt({
          order: {
            ...fullOrderForEmail,
            shippingAddress:
              fullOrderForEmail.shippingAddress as ShippingAddress,
          },
        });
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

    // --- 4. CLEANUP AND SUCCESS RESPONSE ---
    (await cookies()).set("sessionCartId", "", { maxAge: -1 });
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

// Get user's orders
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

// Get sales data and order summary
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

// Get all orders
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

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  console.log(
    `--- [SERVER ACTION] updateOrderToPaidCOD called for orderId: ${orderId} ---`
  );

  try {
    console.log("[1] Fetching order from database...");
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    console.log(`[2] Order fetched. Found: ${!!order}`);
    if (!order) throw new Error("Order not found");

    console.log("[3] Updating order to isPaid: true...");
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    console.log("[4] Order updated successfully.");

    console.log("[5] Fetching full order details for email...");
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
    console.log(
      `[6] Full order details fetched. Sending email to: ${updatedOrderForEmail.user.email}`
    );

    console.log("[7] Attempting to send purchase receipt...");
    sendPurchaseReceipt({
      order: {
        ...updatedOrderForEmail,
        shippingAddress:
          updatedOrderForEmail.shippingAddress as ShippingAddress,
      },
    });
    console.log("[8] sendPurchaseReceipt function called.");

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order has been marked paid",
    };
  } catch (error) {
    console.error(
      "--- [SERVER ACTION ERROR] in updateOrderToPaidCOD ---",
      error
    );
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order has been marked delivered",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
