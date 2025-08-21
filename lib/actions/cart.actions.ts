"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
// import { PrismaClient } from "../generated/prisma";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// const prisma = new PrismaClient();

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 5000 ? 0 : 250),
    // taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: "0.00", // Assuming no tax for simplicity
    totalPrice: totalPrice.toFixed(2),
  };
};

// The complete, corrected function to copy-paste
export async function addItemToCart(data: CartItem) {
  try {
    // --- START OF FIX ---
    // 1. Attempt to get the session ID from the cookies. Use 'let' because it might be reassigned.
    let sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // 2. If the session ID doesn't exist (this is a new user or cleared cookies)...
    if (!sessionCartId) {
      // ...create a new, unique session ID.
      sessionCartId = crypto.randomUUID();
      // ...and set it in the user's browser cookies for the next request.
      cookies().set("sessionCartId", sessionCartId);
    }
    // --- END OF FIX ---

    // Get session and user ID (if logged in)
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get the existing cart. This relies on the fix to getMyCart() where it returns
    // 'undefined' instead of throwing an error if the cookie is missing.
    const cart = await getMyCart();

    // Parse and validate the incoming item data
    const item = cartItemSchema.parse(data);

    // Find the product in the database to ensure it exists and to get its details
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    // CASE 1: The user does NOT have a cart yet.
    if (!cart) {
      // Create a new cart object with the first item.
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        // The sessionCartId is guaranteed to exist now, either from the cookie or the one we just created.
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Save the new cart to the database.
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate the product page path to reflect any changes.
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // CASE 2: The user ALREADY has a cart.
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // Subcase 2a: The item is already in the cart, so we update its quantity.
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        // Find the item and increment its quantity.
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // Subcase 2b: The item is not in the cart, so we add it.
        if (product.stock < 1) throw new Error("Not enough stock");
        // Add the new item to the cart's items array.
        cart.items.push(item);
      }

      // Save the updated cart to the database.
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  // --- THIS IS THE CRITICAL FIX ---
  // If there is no session cookie, it means the user doesn't have a cart.
  // Instead of throwing an error, we gracefully return undefined.
  if (!sessionCartId) {
    return undefined;
  }
  // --- END OF FIX ---

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from the database using either their login ID or session ID
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  // If the database lookup returns nothing, they don't have a cart
  if (!cart) return undefined;

  // If a cart is found, convert decimals to strings and return the plain object
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
