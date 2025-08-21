// FILE: app/admin/orders/page.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { requireAdmin } from "@/lib/auth-guard";
import DeleteDialog from "@/components/shared/delete-dialog";
// --- 1. IMPORT THE GLOBAL ORDER TYPE ---
import { Order } from "@/types";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) => {
  const { page = "1", query: searchText = "" } = searchParams;

  await requireAdmin();

  // 2. Fetch the "raw" data from the server action. It has Date objects.
  const rawOrders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  // 3. Forcefully assert the type to match our client-side definition.
  // This tells TypeScript to treat the Date objects as strings for type-checking purposes.
  const orders = rawOrders as unknown as {
    data: Order[];
    totalPages: number;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Orders</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {/* ... TableHeader content is correct ... */}
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {/* --- THE FINAL FIX --- */}
                  {/* We convert the 'createdAt' string back into a Date object */}
                  {/* right before passing it to the formatting function. */}
                  {formatDateTime(new Date(order.createdAt)).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {formatCurrency(order.totalPrice.toString())}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(new Date(order.paidAt)).dateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(new Date(order.deliveredAt)).dateTime
                    : "Not Delivered"}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
