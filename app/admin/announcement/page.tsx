// In app/admin/announcements/page.tsx
import { AnnouncementList } from "@/components/admin/AnnouncementList";
import { prisma } from "@/db/prisma";
// import { AnnouncementList } from "./_components/AnnouncementList";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Announcements</h1>
      <AnnouncementList announcements={announcements} />
    </div>
  );
}
