"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { prisma } from "@/db/prisma";
import z from "zod";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// sign in the user with credentials
// sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // HIGHLIGHT: 1. Read the `rememberMe` value from the formData.
    // It comes in as a string ("true" or "false"), so we convert it to a boolean.
    const rememberMe = formData.get("rememberMe") === "true";

    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // HIGHLIGHT: 2. Pass the `rememberMe` boolean to the `signIn` function.
    // We spread the existing user object and add the rememberMe property.
    await signIn("credentials", { ...user, rememberMe });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}
// export async function signInWithCredentials(
//   prevState: unknown,
//   formData: FormData
// ) {
//   try {
//     const user = signInFormSchema.parse({
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });

//     await signIn("credentials", user);

//     return { success: true, message: "Signed in successfully" };
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }

//     return { success: false, message: "Invalid email or password" };
//   }
// }

//Sign user out
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

    const plainPassword = user.password;

    user.password = await hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

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
  // --- START DEBUGGING ---
  console.log("--- [SERVER ACTION] updateUserAddress called ---");
  try {
    console.log("[1] Awaiting session...");
    const session = await auth();
    console.log("[2] Session received. User ID:", session?.user?.id);

    if (!session?.user?.id) {
      console.log("[!] No user ID in session. Aborting.");
      // Added a direct return here to be safe
      return { success: false, message: "User not authenticated." };
    }

    console.log("[3] Awaiting database findFirst call...");
    const currentUser = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    console.log(
      "[4] Database findFirst call completed. Found user:",
      !!currentUser
    );

    if (!currentUser) {
      // This will be caught by the catch block below
      throw new Error("User not found in database");
    }

    console.log("[5] Parsing data with Zod...");
    const address = shippingAddressSchema.parse(data);
    console.log("[6] Zod parsing successful.");

    console.log("[7] Awaiting database update call...");
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    console.log("[8] Database update call successful.");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    // Temporary, more robust error handling for debugging
    console.error("--- [SERVER ACTION] CAUGHT AN ERROR ---", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: message };
  }
  // --- END DEBUGGING ---
}
// export async function updateUserAddress(data: ShippingAddress) {
//   try {
//     const session = await auth();

//     const currentUser = await prisma.user.findFirst({
//       where: { id: session?.user?.id },
//     });

//     if (!currentUser) throw new Error("User not found");

//     const address = shippingAddressSchema.parse(data);

//     await prisma.user.update({
//       where: { id: currentUser.id },
//       data: { address },
//     });

//     return {
//       success: true,
//       message: "User updated successfully",
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

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
