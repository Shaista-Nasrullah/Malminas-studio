// In app/admin/pages/[slug]/page.tsx

import { CmsEditForm } from "@/components/admin/CmsEditorForm";
import { prisma } from "@/db/prisma";
import { notFound } from "next/navigation";
// import { CmsEditForm } from "./_components/CmsEditForm";

interface AdminCmsPageProps {
  params: {
    slug: string;
  };
}

export default async function AdminCmsPage({ params }: AdminCmsPageProps) {
  //   const { slug } = params;

  // Fetch the data for the specific page being edited
  const page = await prisma.cmsPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    return notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Page: {page.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        You are editing the public page at `/pages/{page.slug}`
      </p>

      <CmsEditForm page={page} />
    </div>
  );
}
