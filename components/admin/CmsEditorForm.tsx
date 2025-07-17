// In app/admin/pages/[slug]/_components/CmsEditForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CmsPageSchema } from "@/lib/validators";
import type { CmsPage } from "@/types";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
// import { updateCmsPage } from "@/actions/cms";

// --- Tiptap Imports ---
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Heading2,
  Heading3,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { updateCmsPage } from "@/lib/actions/cms";

// --- Toolbar Component ---
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="border border-input bg-transparent rounded-md p-1 flex items-center gap-1 mb-2 flex-wrap">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="mx-2 h-6 w-px bg-muted" />
      <Button
        type="button"
        size="sm"
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// --- Editor Component ---
const CmsEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert rounded-md border border-input bg-background px-3 py-2 min-h-[250px] w-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return (
    <div className="flex flex-col">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// --- Main Form Component ---
type CmsPageFormValues = z.infer<typeof CmsPageSchema>;
interface CmsEditFormProps {
  page: CmsPage;
}

export function CmsEditForm({ page }: CmsEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CmsPageFormValues>({
    resolver: zodResolver(CmsPageSchema),
    defaultValues: { title: page.title || "", content: page.content || "" },
  });

  const onSubmit = (values: CmsPageFormValues) => {
    startTransition(async () => {
      const result = await updateCmsPage(page.slug, values);
      if (result.success) {
        toast.success("Page updated successfully!");
      } else {
        toast.error(result.error || "Failed to update page.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input placeholder="Page Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Content</FormLabel>
              <FormControl>
                <CmsEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
