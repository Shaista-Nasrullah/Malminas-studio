"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { hash } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rememberMe = formData.get("rememberMe") === "true"; // Still handle rememberMe if needed

    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Let NextAuth handle the redirect directly.
    // The default behavior for `signIn` is `redirect: true` to the callbackUrl
    await signIn("credentials", {
      ...user,
      rememberMe, // Pass rememberMe if your NextAuth config uses it
      // Do NOT set redirect: false here if you want NextAuth to handle navigation
    });

    // If signIn succeeds, it will perform a redirect,
    // so this line should ideally not be reached unless there's an issue
    // or if a redirect doesn't happen for some reason.
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // Crucially, if `signIn` causes a redirect, it throws a special error.
    // We need to re-throw it so Next.js handles it.
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("signInWithCredentials: Error during sign in:", error);
    return {
      success: false,
      message: "Invalid email or password", // More generic message for security
    };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password; // Keep plain password for immediate sign-in

    // Hash the password for storage
    user.password = await hash(user.password, 10);

    await prisma.user.create({
      data: { name: user.name, email: user.email, password: user.password },
    });

    // Sign in the user immediately after they sign up.
    // This will also cause a redirect if successful.
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
      // Do NOT set redirect: false here
    });

    // Similar to signInWithCredentials, this point might not be reached if redirect occurs
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("signUpUser: Error during sign up:", error);
    return { success: false, message: formatError(error) };
  }
}

// ... (formatError function remains the same)
// --- ALL OTHER FUNCTIONS IN THE FILE REMAIN UNCHANGED ---

//Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "User not authenticated." };
    }
    const currentUser = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    if (!currentUser) {
      throw new Error("User not found in database");
    }
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: message };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("User not found");
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};
  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await prisma.user.count();
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
