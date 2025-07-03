import Link from "next/link";
import {
  deleteCategory,
  getAllCategoriesForAdmin,
} from "@/lib/actions/category.actions";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Categories",
};

const AdminCategoriesPage = async () => {
  await requireAdmin();

  const categories = await getAllCategoriesForAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="h2-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/create-category">Create Category</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">SUB-CATEGORIES</TableHead>
            <TableHead>CREATED AT</TableHead>
            <TableHead className="w-[150px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No categories found.
              </TableCell>
            </TableRow>
          )}
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{formatId(category.id)}</TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-right">
                {category._count.subCategories}
              </TableCell>
              <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/categories/${category.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={category.id} action={deleteCategory} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCategoriesPage;
