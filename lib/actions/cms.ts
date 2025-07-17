// In actions/cms.ts
"use server";

import { prisma } from "@/db/prisma";
import { CmsPageSchema } from "@/lib/validators"; // We already created this
import { revalidatePath } from "next/cache";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export async function updateCmsPage(
  slug: string,
  data: z.infer<typeof CmsPageSchema>
) {
  try {
    // IMPORTANT TODO: Add authentication here! Check if the user is an admin.
    // e.g., const session = await auth(); if (session?.user.role !== 'admin') throw new Error('Unauthorized');

    const validatedData = CmsPageSchema.parse(data);

    // Sanitize the HTML content before saving it to the database
    const sanitizedContent = DOMPurify.sanitize(validatedData.content);

    await prisma.cmsPage.update({
      where: { slug },
      data: {
        title: validatedData.title,
        content: sanitizedContent, // Save the safe, clean HTML
      },
    });

    // Tell Next.js to refresh the data for these pages
    revalidatePath(`/pages/${slug}`);
    revalidatePath(`/admin/pages/${slug}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Failed to update CMS page:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
