// FILE: app/user/orders/page.tsx

import { Metadata } from "next";
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
// --- 1. IMPORT THE GLOBAL ORDER TYPE ---
import { Order } from "@/types";

export const metadata: Metadata = {
  title: "My Orders",
};

// --- CORRECTED ---: Props are a plain object, not a promise
const OrdersPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const { page = "1" } = searchParams;

  // 2. Fetch the "raw" data. It has Date objects.
  const rawOrders = await getMyOrders({
    page: Number(page) || 1,
  });

  // 3. Forcefully assert the type to match our client-side definition.
  const orders = rawOrders as unknown as {
    data: Order[];
    totalPages: number;
  };

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
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
                  {/* Convert the 'createdAt' string back into a Date object */}
                  {formatDateTime(new Date(order.createdAt)).dateTime}
                </TableCell>
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
                  <Link href={`/order/${order.id}`}>
                    <span className="px-2 cursor-pointer">Details</span>
                  </Link>
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

export default OrdersPage;
