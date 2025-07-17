// In components/shared/header/top-header.tsx

import { prisma } from "@/db/prisma";
import { AnnouncementCarousel } from "./AnnouncementCarousel";

export async function TopHeader() {
  // Fetch all announcements that are marked as active
  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Pass the fetched data to the interactive client component
  return <AnnouncementCarousel announcements={announcements} />;
}
