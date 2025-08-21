// FILE: app/(root)/order/[id]/page.tsx

import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { ShippingAddress, Order } from "@/types";
import OrderConfirmationDisplay from "./order-details-table";

export const metadata: Metadata = {
  title: "Thank You For Your Order",
};

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const orderFromDb = await getOrderById(id);
  if (!orderFromDb) {
    notFound();
  }

  // --- THIS IS THE FINAL FIX ---
  // We manually convert ALL fields to strings to match the 'Order' type.
  const formattedOrder: Order = {
    ...orderFromDb,
    itemsPrice: orderFromDb.itemsPrice.toString(),
    shippingPrice: orderFromDb.shippingPrice.toString(),
    taxPrice: orderFromDb.taxPrice.toString(),
    totalPrice: orderFromDb.totalPrice.toString(),
    createdAt: orderFromDb.createdAt.toISOString(),
    paidAt: orderFromDb.paidAt ? orderFromDb.paidAt.toISOString() : null,
    deliveredAt: orderFromDb.deliveredAt
      ? orderFromDb.deliveredAt.toISOString()
      : null,
    shippingAddress: orderFromDb.shippingAddress as ShippingAddress,
    // Ensure orderitems also have their price converted
    orderitems: orderFromDb.orderitems.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  };

  return <OrderConfirmationDisplay order={formattedOrder} />;
};

export default OrderDetailsPage;
