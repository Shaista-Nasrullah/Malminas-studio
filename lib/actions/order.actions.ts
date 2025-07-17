"use server";

import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, ShippingAddress } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
// import { paypal } from "../paypal";
// import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/email";
import { cookies } from "next/headers";
// import { Prisma } from "@prisma/client";
// import { sendPurchaseReceipt } from "@/email";

// In lib/actions/order.actions.ts

// ... (other imports: prisma, z, auth, etc.)
import { shippingAddressSchema } from "@/lib/validators";
import z from "zod";

// Define the schema for the data coming from the guest form
const guestOrderPayloadSchema = shippingAddressSchema.extend({
  email: z.string().email(),
  paymentMethod: z.string(),
});

// export const createOrderWithGuest = async (
//   formData: z.infer<typeof guestOrderPayloadSchema>
// ) => {
//   try {
//     let userId: string;
//     const session = await auth();

//     if (session?.user) {
//       // Case 1: User is already logged in
//       userId = session.user.id as string;
//     } else {
//       // Case 2: Guest Checkout
//       const validation = guestOrderPayloadSchema.safeParse(formData);
//       if (!validation.success) {
//         return { success: false, message: "Invalid form data." };
//       }
//       const { email, fullName } = validation.data;

//       // Check if a user account already exists with this email
//       const existingUser = await prisma.user.findUnique({ where: { email } });

//       if (existingUser) {
//         // IMPORTANT: Do not proceed. Ask the user to log in.
//         return {
//           success: false,
//           message: "An account with this email already exists.",
//           errorType: "ACCOUNT_EXISTS", // Custom error type for the client
//         };
//       }

//       // Create a new user account for the guest
//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           name: fullName,
//           // You can leave password null/empty or generate a random one
//           // This user can later use "Forgot Password" to set one
//         },
//       });
//       userId = newUser.id;
//     }

//     // --- From this point, the logic is the same as before ---
//     // We are GUARANTEED to have a `userId`

//     // Get cart
//     const cartId = cookies().get("cartId")?.value;
//     if (!cartId) throw new Error("Cart not found.");
//     const cart = await prisma.cart.findUnique({
//       where: { id: cartId },
//       include: { items: true },
//     });
//     if (!cart) throw new Error("Cart is empty.");

//     // Calculate prices securely
//     const itemsPrice = cart.items.reduce(
//       (acc, item) => acc + Number(item.price) * item.qty,
//       0
//     );
//     const shippingPrice = itemsPrice > 5000 ? 0 : 250;
//     const taxPrice = 0;
//     const totalPrice = itemsPrice + shippingPrice + taxPrice;

//     // Assemble and create the order in a transaction
//     const newOrder = await prisma.$transaction(async (tx) => {
//       const order = await tx.order.create({
//         data: {
//           userId,
//           shippingAddress: {
//             fullName: formData.fullName,
//             streetAddress: formData.streetAddress,
//             city: formData.city,
//             country: formData.country,
//             postalCode: formData.postalCode || "",
//             phone: formData.phone,
//           },
//           paymentMethod: formData.paymentMethod,
//           itemsPrice,
//           shippingPrice,
//           taxPrice,
//           totalPrice,
//           orderitems: {
//             create: cart.items.map((item) => ({
//               name: item.name,
//               slug: item.slug,
//               qty: item.qty,
//               image: item.image,
//               price: item.price,
//               productId: item.productId,
//             })),
//           },
//         },
//       });

//       // Also update the user's address/payment method for future checkouts
//       await tx.user.update({
//         where: { id: userId },
//         data: {
//           address: {
//             fullName: formData.fullName,
//             streetAddress: formData.streetAddress,
//             city: formData.city,
//             country: formData.country,
//             postalCode: formData.postalCode || "",
//             phone: formData.phone,
//           },
//           paymentMethod: formData.paymentMethod,
//         },
//       });
//       return order;
//     });

//     // Clean up cart
//     await prisma.cart.delete({ where: { id: cartId } });
//     cookies().set("cartId", "", { maxAge: -1 });

//     revalidatePath("/my-orders");
//     return {
//       success: true,
//       message: "Order has been created.",
//       redirectTo: `/my-orders/${newOrder.id}`,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: (error as Error).message || "An unexpected error occurred.",
//     };
//   }
// };

// Create order and create the order items
// export async function createOrder() {
//   console.log("--- [SERVER ACTION] createOrder: Initiated ---");
//   try {
//     console.log("[1] Checking authentication session...");
//     const session = await auth();
//     if (!session) {
//       // This will be caught by the catch block
//       throw new Error("User is not authenticated");
//     }
//     console.log(`[2] Session found for user ID: ${session.user?.id}`);

//     console.log("[3] Fetching user's cart...");
//     const cart = await getMyCart();
//     console.log(
//       "[4] Cart fetched. Cart ID:",
//       cart?.id,
//       "Item count:",
//       cart?.items.length
//     );

//     const userId = session?.user?.id;
//     if (!userId) {
//       throw new Error("User ID not found in session after successful auth");
//     }

//     console.log(`[5] Fetching full user object for ID: ${userId}`);
//     const user = await getUserById(userId);
//     console.log(
//       "[6] User object fetched. User has address:",
//       !!user.address,
//       "User has payment method:",
//       !!user.paymentMethod
//     );

//     if (!cart || cart.items.length === 0) {
//       console.log("[!] Validation Failed: Cart is empty. Aborting.");
//       return {
//         success: false,
//         message: "Your cart is empty",
//         redirectTo: "/cart",
//       };
//     }

//     if (!user.address) {
//       console.log(
//         "[!] Validation Failed: Shipping address is missing. Aborting."
//       );
//       return {
//         success: false,
//         message: "No shipping address",
//         redirectTo: "/shipping-address",
//       };
//     }

//     if (!user.paymentMethod) {
//       console.log(
//         "[!] Validation Failed: Payment method is missing. Aborting."
//       );
//       return {
//         success: false,
//         message: "No payment method",
//         redirectTo: "/payment-method",
//       };
//     }

//     // Create order object to be parsed by Zod
//     const orderDataToParse = {
//       userId: user.id,
//       shippingAddress: user.address,
//       paymentMethod: user.paymentMethod,
//       itemsPrice: cart.itemsPrice,
//       shippingPrice: cart.shippingPrice,
//       taxPrice: cart.taxPrice,
//       totalPrice: cart.totalPrice,
//     };

//     console.log(
//       "[7] Preparing to parse order data with Zod. Data:",
//       JSON.stringify(orderDataToParse, null, 2)
//     );
//     const order = insertOrderSchema.parse(orderDataToParse);
//     console.log(
//       "[8] Zod parsing successful. Proceeding to database transaction."
//     );

//     // Create a transaction to create order and order items in database
//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       console.log("  [TX] Inside transaction: Creating order...");

//       const insertedOrder = await tx.order.create({ data: order });
//       console.log(`  [TX] Order created with ID: ${insertedOrder.id}`);

//       console.log(`  [TX] Creating ${cart.items.length} order items...`);
//       for (const item of cart.items as CartItem[]) {
//         await tx.orderItem.create({
//           data: {
//             ...item,
//             price: item.price,
//             orderId: insertedOrder.id,
//           },
//         });
//       }
//       console.log("  [TX] All order items created.");

//       console.log(`  [TX] Clearing cart with ID: ${cart.id}`);
//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           totalPrice: 0,
//           taxPrice: 0,
//           shippingPrice: 0,
//           itemsPrice: 0,
//         },
//       });
//       console.log("  [TX] Cart cleared successfully.");

//       return insertedOrder.id;
//     });
//     console.log(
//       `[9] Database transaction completed successfully. Returned Order ID: ${insertedOrderId}`
//     );

//     if (!insertedOrderId) {
//       throw new Error("Transaction completed but no Order ID was returned.");
//     }

//     console.log("[10] Returning success response.");
//     return {
//       success: true,
//       message: "Order created",
//       redirectTo: `/order/${insertedOrderId}`,
//     };
//   } catch (error) {
//     // This is the most important log for debugging errors
//     console.error("--- [!!!] CREATE ORDER FAILED. CAUGHT IN CATCH BLOCK ---");
//     console.error("Raw Error:", error);
//     // -------------------------------------------------------------------

//     if (isRedirectError(error)) throw error;
//     // For debugging, it's safer to see the raw error message first
//     const message =
//       error instanceof Error
//         ? error.message
//         : "An unknown error occurred during order creation.";
//     return { success: false, message: message };
//   }
// }

// This is the schema for the data we expect from the client form
// lib/actions/order.actions.ts

// lib/actions/order.actions.ts

// This schema validates the incoming form data from the client
// lib/actions/order.actions.ts

// This is the schema for data coming from the client form
// lib/actions/order.actions.ts

// This schema validates the data we expect from the client form
const placeOrderFormSchema = shippingAddressSchema.extend({
  email: z.string().email(),
  paymentMethod: z.string(),
});

export const placeOrder = async (
  formData: z.infer<typeof placeOrderFormSchema>
) => {
  try {
    let userId: string;
    const session = await auth();

    // --- 1. USER HANDLING ---
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Guest Flow: Find or create a user.
      const { email, fullName } = formData;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        // Prevent guest checkout if email is already tied to an account
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

    // --- 2. CART HANDLING (THE CORRECT WAY) ---
    // We call your perfected `getMyCart` function. It will handle
    // finding the cart for both logged-in users and guests.
    const cart = await getMyCart();

    // If getMyCart returns nothing or an empty cart, throw the error.
    if (!cart || cart.items.length === 0) {
      throw new Error(
        "Your cart is empty. Please add items before checking out."
      );
    }

    // --- 3. VALIDATION & ORDER CREATION ---
    // Assemble the complete order data using the cart data we just fetched.
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

    // Use your master `insertOrderSchema` for final server-side validation.
    const validatedOrder = insertOrderSchema.parse(orderDataToValidate);

    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order using the fully validated data
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

      // Update the user's details for their next visit
      await tx.user.update({
        where: { id: userId },
        data: {
          address: validatedOrder.shippingAddress,
          paymentMethod: validatedOrder.paymentMethod,
        },
      });

      // Delete the cart now that the order is created
      await tx.cart.delete({ where: { id: cart.id } });
      return order;
    });

    // --- 4. CLEANUP ---
    // Clean up the browser cookie since the cart is gone.
    cookies().set("sessionCartId", "", { maxAge: -1 });

    revalidatePath("/my-orders");
    return {
      success: true,
      message: "Order has been created successfully.",
      redirectTo: `/order/${newOrder.id}`,
    };
  } catch (error) {
    // This will catch any error, including the "Your cart is empty" one.
    return {
      success: false,
      message: (error as Error).message || "An unexpected error occurred.",
    };
  }
};

// You can keep your other user/order actions below if needed
// export const updateUserAddress = ...
// export const createOrder = ... (the old one)
// Get order by id
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
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
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

// Corrected function for updating COD order to paid
// FILE: lib/actions/order.actions.ts

export async function updateOrderToPaidCOD(orderId: string) {
  // -- ADD THIS LOG --
  console.log(
    `--- [SERVER ACTION] updateOrderToPaidCOD called for orderId: ${orderId} ---`
  );

  try {
    // -- ADD THIS LOG --
    console.log("[1] Fetching order from database...");
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    // -- ADD THIS LOG --
    console.log(`[2] Order fetched. Found: ${!!order}`);
    if (!order) throw new Error("Order not found");

    // -- ADD THIS LOG --
    console.log("[3] Updating order to isPaid: true...");
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    console.log("[4] Order updated successfully.");

    // -- ADD THIS LOG --
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

    // -- ADD THIS LOG BEFORE SENDING --
    console.log("[7] Attempting to send purchase receipt...");
    sendPurchaseReceipt({
      // This is where the email is sent
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
    // -- ADD THIS LOG --
    console.error(
      "--- [SERVER ACTION ERROR] in updateOrderToPaidCOD ---",
      error
    );
    return { success: false, message: formatError(error) };
  }
}

// // Update COD order to paid
// export async function updateOrderToPaidCOD(orderId: string) {
//   try {
//     const order = await prisma.order.findFirst({
//       where: {
//         id: orderId,
//       },
//     });

//     if (!order) throw new Error("Order not found");

//     const updatedOrder = await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         isPaid: true,
//         paidAt: new Date(),
//       },
//     });

//     sendPurchaseReceipt({
//       order: {
//         ...updatedOrder,
//         shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
//       },
//     });

//     revalidatePath(`/order/${orderId}`);

//     return {
//       success: true,
//       message: "Order has been marked paid",
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

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
