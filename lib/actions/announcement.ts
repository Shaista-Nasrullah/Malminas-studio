// In actions/announcements.ts
"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
  text: z.string().min(5, "Announcement text must be at least 5 characters."),
});

// CREATE action
export async function createAnnouncement(formData: FormData) {
  const validated = announcementSchema.safeParse({
    text: formData.get("text"),
  });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  await prisma.announcement.create({
    data: { text: validated.data.text },
  });

  revalidatePath("/admin/announcements");
  return { success: true };
}

// UPDATE action
export async function updateAnnouncement(id: string, text: string) {
  const validated = announcementSchema.safeParse({ text });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  await prisma.announcement.update({
    where: { id },
    data: { text: validated.data.text },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout"); // Revalidate the public layout
}

// DELETE action
export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}

// --- NEW/UPDATED ACTION to toggle active status ---
export async function toggleAnnouncementActive(
  id: string,
  currentState: boolean
) {
  // TODO: Add authentication to ensure only an admin can do this!

  await prisma.announcement.update({
    where: { id },
    data: { isActive: !currentState }, // Set it to the opposite of its current state
  });

  // Revalidate both admin and public pages
  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
}
