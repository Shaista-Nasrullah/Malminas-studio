// In db/seed-cms.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ... (keep all your existing CMS page content and seeding logic)

async function main() {
  // ... (your existing CMS page seeding loop)

  // --- NEW: Seed the initial announcement ---
  console.log("Seeding initial announcement...");
  // Use upsert to avoid creating duplicates on re-seed
  await prisma.announcement.upsert({
    where: { id: "initial-summer-sale" }, // A fixed ID for the first announcement
    update: {}, // Don't overwrite if it exists
    create: {
      id: "initial-summer-sale",
      text: "SUMMER SALE GET UPTO 30% OFF",
      isActive: true, // Make the first one active by default
    },
  });
  console.log("Announcement seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
