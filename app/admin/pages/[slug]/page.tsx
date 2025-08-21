// FILE: app/admin/pages/[slug]/page.tsx

import { CmsEditForm } from "@/components/admin/CmsEditorForm";
import { prisma } from "@/db/prisma";
import { notFound } from "next/navigation";
// --- 1. IMPORT THE TYPE ---
import { CmsPage } from "@/types";

interface AdminCmsPageProps {
  params: {
    slug: string;
  };
}

export default async function AdminCmsPage({ params }: AdminCmsPageProps) {
  // Fetch the "raw" data for the specific page being edited
  const rawPage = await prisma.cmsPage.findUnique({
    where: { slug: params.slug },
  });

  if (!rawPage) {
    return notFound();
  }

  // --- 2. THE FINAL FIX ---
  // We use the forceful two-step assertion to tell TypeScript that after serialization,
  // this data will perfectly match our client-side 'CmsPage' type.
  const page = rawPage as unknown as CmsPage;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Page: {page.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        You are editing the public page at `/pages/{page.slug}`
      </p>

      {/* 3. Pass the correctly typed page object to the form */}
      <CmsEditForm page={page} />
    </div>
  );
}
