"use client";

import { toast } from "sonner";
import { categoryFormDefaultValues } from "@/lib/constants";
import { categoryFormSchema } from "@/lib/validators";
import { CategoryFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import {
  createCategoryWithSubCategories,
  updateCategoryWithSubCategories,
} from "@/lib/actions/category.actions";
import { Trash, X } from "lucide-react"; // <-- IMPORT X ICON

const CategoryForm = ({
  type,
  initialData,
  categoryId,
}: {
  type: "Create" | "Update";
  initialData?: CategoryFormData;
  categoryId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || categoryFormDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  // NEW: Handler to delete an image from the form state
  const handleImageDelete = (imageUrl: string) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = currentImages.filter((img) => img !== imageUrl);
    form.setValue("images", updatedImages);
    toast.info("Image removed. Save the category to apply changes.");
  };

  const onSubmit: SubmitHandler<z.infer<typeof categoryFormSchema>> = async (
    values
  ) => {
    if (type === "Create") {
      const res = await createCategoryWithSubCategories(values);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/categories");
      }
    }

    if (type === "Update") {
      if (!categoryId) {
        toast.error("Category ID not found.");
        return;
      }
      const res = await updateCategoryWithSubCategories(categoryId, values);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/categories");
      }
    }
  };

  const images = form.watch("images");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tribal Jewellery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center gap-2">
                        <Input
                          placeholder="e.g., tribal-jewellery"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nameValue = form.getValues("name");
                            form.setValue(
                              "slug",
                              slugify(nameValue, { lower: true, strict: true })
                            );
                          }}
                        >
                          Generate
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- UPDATED IMAGES FIELD --- */}
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Images</FormLabel>
                  <div className="flex flex-wrap items-start gap-4">
                    {images?.map((image) => (
                      <div key={image} className="relative group">
                        <Image
                          src={image}
                          alt="category image"
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageDelete(image)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <FormControl>
                      <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-md">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              const newUrls = res.map((r) => r.url);
                              form.setValue("images", [
                                ...(images || []),
                                ...newUrls,
                              ]);
                              toast.success("Image(s) uploaded.");
                            }
                          }}
                          onUploadError={(error) => toast.error(error.message)}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* --- END OF UPDATED IMAGES FIELD --- */}
          </CardContent>
        </Card>

        {/* ... (Sub-Categories and Submit button remain the same) ... */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Sub-Categories</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", slug: "" })}
            >
              Add Sub-Category
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground p-4 text-center">
                No sub-categories added. Click the button above to add one.
              </p>
            )}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-4 items-start p-4 border rounded-lg bg-muted/50"
              >
                <FormField
                  control={form.control}
                  name={`subCategories.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Anklet Pairs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`subCategories.${index}.slug`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., anklet-pairs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Category`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
