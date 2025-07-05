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
    // IMPORTANT: In "Update" mode, we must ensure form fields match their expected types.
    // Price from the DB is a Decimal/number, but the input expects a string.
    // The discount will be a number, which is fine for `type="number"`.
    defaultValues:
      product && type === "Update"
        ? {
            ...product,
            price: String(product.price), // Convert Decimal/number to string
            discountPercentage: product.discountPercentage || 0, // Ensure it's populated
          }
        : productDefaultValues,
  });

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
        {/* Name and Slug */}
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

        {/* Categories */}
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

        {/* Brand */}
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

        {/* --- UPDATED PRICE AND ADDED DISCOUNT --- */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* 1. Price field label is updated */}
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

          {/* 2. New Discount Percentage field is added */}
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
        {/* --- END OF CHANGES --- */}

        {/* Images, Description, isFeatured etc. remain below */}
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error("An error occurred", {
                              description: error.message,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

// "use client";

// import { toast } from "sonner";
// import { productDefaultValues } from "@/lib/constants";
// import { insertProductSchema } from "@/lib/validators";
// import { Category, Product, SubCategory } from "@/types"; // Import Category and SubCategory types
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useState } from "react"; // Import useEffect and useState
// import slugify from "slugify";

// // UI Components
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import { Card, CardContent } from "../ui/card";
// import Image from "next/image";
// import { Checkbox } from "../ui/checkbox";
// import { UploadButton } from "@/lib/uploadthing";

// // Actions
// import { createProduct, updateProduct } from "@/lib/actions/prodct.actions";

// const ProductForm = ({
//   type,
//   product,
//   productId,
//   categories, // 1. Accept the new categories prop
// }: {
//   type: "Create" | "Update";
//   product?: Product;
//   productId?: string;
//   categories: Category[]; // Define the type for the prop
// }) => {
//   const router = useRouter();
//   // 2. State to hold the list of sub-categories for the selected category
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

//   const form = useForm<z.infer<typeof insertProductSchema>>({
//     resolver: zodResolver(insertProductSchema), // Simplified resolver for clarity
//     defaultValues:
//       product && type === "Update"
//         ? {
//             ...product,
//             price: product.price.toString(), // Ensure price is a string for the form
//           }
//         : productDefaultValues,
//   });

//   // 3. Watch the 'categoryId' field for changes
//   const selectedCategoryId = form.watch("categoryId");

//   // 4. This effect updates the sub-category dropdown whenever the main category changes
//   useEffect(() => {
//     if (selectedCategoryId) {
//       const selectedCategory = categories.find(
//         (c) => c.id === selectedCategoryId
//       );
//       setSubCategories(selectedCategory?.subCategories || []);
//       // If the selected category changes, reset the sub-category field
//       // to prevent submitting a stale/invalid sub-category ID
//       if (product?.categoryId !== selectedCategoryId) {
//         form.setValue("subCategoryId", "");
//       }
//     } else {
//       setSubCategories([]);
//     }
//   }, [selectedCategoryId, categories, form, product?.categoryId]);

//   // 5. This effect runs once on mount to set initial sub-categories for "Update" mode
//   useEffect(() => {
//     if (type === "Update" && product?.categoryId) {
//       const initialCategory = categories.find(
//         (c) => c.id === product.categoryId
//       );
//       if (initialCategory) {
//         setSubCategories(initialCategory.subCategories || []);
//       }
//     }
//   }, [type, product, categories]);

//   const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
//     values
//   ) => {
//     // Make sure nullable subCategoryId is handled correctly
//     const submissionValues = {
//       ...values,
//       subCategoryId: values.subCategoryId || null,
//     };

//     if (type === "Create") {
//       const res = await createProduct(submissionValues);
//       if (!res.success) toast.error(res.message);
//       else {
//         toast.success(res.message);
//         router.push("/admin/products");
//       }
//     }

//     if (type === "Update" && productId) {
//       const res = await updateProduct({ ...submissionValues, id: productId });
//       if (!res.success) toast.error(res.message);
//       else {
//         toast.success(res.message);
//         router.push("/admin/products");
//       }
//     }
//   };

//   const images = form.watch("images");
//   const isFeatured = form.watch("isFeatured");
//   const banner = form.watch("banner");

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {/* Name and Slug - No Changes */}
//         <div className="flex flex-col md:flex-row gap-5">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Product Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter product name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="slug"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Slug</FormLabel>
//                 <FormControl>
//                   <div className="flex items-center gap-2">
//                     <Input placeholder="Enter slug" {...field} />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() =>
//                         form.setValue(
//                           "slug",
//                           slugify(form.getValues("name"), {
//                             lower: true,
//                             strict: true,
//                           })
//                         )
//                       }
//                     >
//                       Generate
//                     </Button>
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* --- REPLACED CATEGORY INPUT WITH DROPDOWNS --- */}
//         <div className="flex flex-col md:flex-row gap-5">
//           {/* Category Dropdown */}
//           <FormField
//             control={form.control}
//             name="categoryId"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Sub-Category Dropdown */}
//           <FormField
//             control={form.control}
//             name="subCategoryId"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Sub-Category (Optional)</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   // IMPORTANT: Ensure the value is always a string.
//                   // `field.value` can be null/undefined initially, so we default to ""
//                   value={field.value || ""}
//                   disabled={subCategories.length === 0}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       {/* The placeholder will now show correctly when the value is "" */}
//                       <SelectValue placeholder="Select a sub-category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {/*
//                       REMOVED: The item with an empty value.
//                       The placeholder handles the "None" state.
//                     */}
//                     {/* <SelectItem value="">None</SelectItem> */}

//                     {subCategories.map((sub) => (
//                       <SelectItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Brand - No Changes */}
//         <FormField
//           control={form.control}
//           name="brand"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Brand</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter brand" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Price and Stock - No Changes */}
//         <div className="flex flex-col md:flex-row gap-5">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Price</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="stock"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Stock</FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="0" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Images and Description - No Changes to JSX, but check logic */}
//         {/* ... your existing JSX for images, description, isFeatured ... */}
//         {/* ... I will omit them for brevity, but they should remain here ... */}

//         <div className="upload-field flex flex-col md:flex-row gap-5">
//           <FormField
//             control={form.control}
//             name="images"
//             render={() => (
//               <FormItem className="w-full">
//                 <FormLabel>Images</FormLabel>
//                 <Card>
//                   <CardContent className="space-y-2 mt-2 min-h-48">
//                     <div className="flex-start space-x-2">
//                       {images.map((image: string) => (
//                         <Image
//                           key={image}
//                           src={image}
//                           alt="product image"
//                           className="w-20 h-20 object-cover object-center rounded-sm"
//                           width={100}
//                           height={100}
//                         />
//                       ))}
//                       <FormControl>
//                         <UploadButton
//                           endpoint="imageUploader"
//                           onClientUploadComplete={(res: { url: string }[]) => {
//                             form.setValue("images", [...images, res[0].url]);
//                           }}
//                           onUploadError={(error: Error) => {
//                             toast.error("An error occurred", {
//                               description: error.message,
//                             });
//                           }}
//                         />
//                       </FormControl>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="upload-field">
//           {/* isFeatured */}
//           Featured Product
//           <Card>
//             <CardContent className="space-y-2 mt-2">
//               <FormField
//                 control={form.control}
//                 name="isFeatured"
//                 render={({ field }) => (
//                   <FormItem className="space-x-2 items-center">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <FormLabel>Is Featured?</FormLabel>
//                   </FormItem>
//                 )}
//               />
//               {isFeatured && banner && (
//                 <Image
//                   src={banner}
//                   alt="banner image"
//                   className="w-full object-cover object-center rounded-sm"
//                   width={1920}
//                   height={680}
//                 />
//               )}

//               {isFeatured && !banner && (
//                 <UploadButton
//                   endpoint="imageUploader"
//                   onClientUploadComplete={(res: { url: string }[]) => {
//                     form.setValue("banner", res[0].url);
//                   }}
//                   onUploadError={(error: Error) => {
//                     toast.error("An error occurred", {
//                       description: error.message,
//                     });
//                   }}
//                 />
//               )}
//             </CardContent>
//           </Card>
//         </div>
//         <div>
//           {/* Description */}
//           <FormField
//             control={form.control}
//             name="description"
//             render={({
//               field,
//             }: {
//               field: ControllerRenderProps<
//                 z.infer<typeof insertProductSchema>,
//                 "description"
//               >;
//             }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Enter product description"
//                     className="resize-none"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div>
//           <Button
//             type="submit"
//             size="lg"
//             disabled={form.formState.isSubmitting}
//             className="w-full"
//           >
//             {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default ProductForm;
