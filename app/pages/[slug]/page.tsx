// In app/pages/[slug]/page.tsx

import { prisma } from "@/db/prisma"; // <-- CORRECTED IMPORT
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export async function generateStaticParams() {
  try {
    const pages = await prisma.cmsPage.findMany({
      // <-- CORRECTED VARIABLE
      select: { slug: true },
    });
    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for CMS pages:", error);
    return [];
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const page = await prisma.cmsPage.findUnique({
    // <-- CORRECTED VARIABLE
    where: { slug: params.slug },
    select: { title: true },
  });

  return {
    title: page?.title || "Page", // Fallback title
  };
}

export default async function Page({ params }: PageProps) {
  const page = await prisma.cmsPage.findUnique({
    // <-- CORRECTED VARIABLE
    where: { slug: params.slug },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold tracking-tight mb-8 text-center sm:text-left">
        {page.title}
      </h1>
      <article className="prose lg:prose-xl dark:prose-invert max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {page.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
