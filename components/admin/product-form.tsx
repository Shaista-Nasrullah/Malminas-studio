"use client";

import { toast } from "sonner";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema } from "@/lib/validators";
import { Category, Product, SubCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import slugify from "slugify";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react"; // <-- IMPORT THE ICON

// Actions
import { createProduct, updateProduct } from "@/lib/actions/prodct.actions";

const ProductForm = ({
  type,
  product,
  productId,
  categories,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
  categories: Category[];
}) => {
  const router = useRouter();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update"
        ? {
            ...product,
            price: String(product.price),
            discountPercentage: product.discountPercentage || 0,
          }
        : productDefaultValues,
  });

  // NEW: Handler to delete an image from the form state
  const handleImageDelete = (imageUrl: string) => {
    const currentImages = form.getValues("images");
    const updatedImages = currentImages.filter((img) => img !== imageUrl);
    form.setValue("images", updatedImages);
    toast.info("Image removed. Save the product to apply changes.");
  };

  const selectedCategoryId = form.watch("categoryId");

  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (c) => c.id === selectedCategoryId
      );
      setSubCategories(selectedCategory?.subCategories || []);
      if (product?.categoryId !== selectedCategoryId) {
        form.setValue("subCategoryId", "");
      }
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, categories, form, product?.categoryId]);

  useEffect(() => {
    if (type === "Update" && product?.categoryId) {
      const initialCategory = categories.find(
        (c) => c.id === product.categoryId
      );
      if (initialCategory) {
        setSubCategories(initialCategory.subCategories || []);
      }
    }
  }, [type, product, categories]);

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    const submissionValues = {
      ...values,
      subCategoryId: values.subCategoryId || null,
    };

    if (type === "Create") {
      const res = await createProduct(submissionValues);
      if (!res.success) toast.error(res.message);
      else {
        toast.success(res.message);
        router.push("/admin/products");
      }
    }

    if (type === "Update" && productId) {
      const res = await updateProduct({ ...submissionValues, id: productId });
      if (!res.success) toast.error(res.message);
      else {
        toast.success(res.message);
        router.push("/admin/products");
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ... (all your other form fields remain the same) ... */}
        {/* Name and Slug, Categories, Brand, Price etc. */}
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
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
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), {
                            lower: true,
                            strict: true,
                          })
                        )
                      }
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

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sub-Category (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={subCategories.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Original Price (Rs)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount Percentage (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 15 for 15% off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountEndDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount End Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- UPDATED IMAGES FIELD --- */}
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-4 mt-4 min-h-48">
                    <div className="flex flex-wrap items-start gap-4">
                      {images.map((image: string) => (
                        <div key={image} className="relative group">
                          <Image
                            src={image}
                            alt="product image"
                            className="w-24 h-24 object-cover object-center rounded-md"
                            width={100}
                            height={100}
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
                            onClientUploadComplete={(
                              res: { url: string }[]
                            ) => {
                              if (res && res.length > 0) {
                                form.setValue("images", [
                                  ...images,
                                  ...res.map((r) => r.url),
                                ]);
                                toast.success(
                                  "Image(s) uploaded successfully."
                                );
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast.error("An error occurred", {
                                description: error.message,
                              });
                            }}
                          />
                        </div>
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* --- END OF UPDATED IMAGES FIELD --- */}

        {/* ... (rest of your form: isFeatured, Description, etc.) ... */}
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("An error occurred", {
                      description: error.message,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "description"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
