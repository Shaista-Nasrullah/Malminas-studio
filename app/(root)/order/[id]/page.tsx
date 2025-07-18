// app/orders/[id]/page.tsx

import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound, redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import OrderConfirmationDisplay from "./order-details-table";
// --- 1. RENAME THE IMPORTED COMPONENT ---
// import OrderConfirmationDisplay from "./order-confirmation-display";

export const metadata: Metadata = {
  title: "Thank You For Your Order",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  // IMPORTANT: For security, you should re-enable this check
  if (order.userId !== session?.user.id && session?.user.role !== "admin") {
    return redirect("/unauthorized");
  }

  // --- 2. RENDER THE NEW COMPONENT ---
  // The isAdmin prop is not needed for the customer view.
  return (
    <OrderConfirmationDisplay
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetailsPage;

// import { Metadata } from "next";
// import { getOrderById } from "@/lib/actions/order.actions";
// import { notFound } from "next/navigation";
// import OrderDetailsTable from "./order-details-table";
// import { ShippingAddress } from "@/types";
// import { auth } from "@/auth";

// export const metadata: Metadata = {
//   title: "Order Details",
// };

// const OrderDetailsPage = async (props: {
//   params: Promise<{
//     id: string;
//   }>;
// }) => {
//   const { id } = await props.params;

//   const order = await getOrderById(id);
//   if (!order) notFound();

//   const session = await auth();

//   //   Redirect the user if they don't own the order

//   // if (order.userId !== session?.user.id && session?.user.role !== "admin") {
//   //   return redirect("/unauthorized");
//   // }

//   return (
//     <OrderDetailsTable
//       order={{
//         ...order,
//         shippingAddress: order.shippingAddress as ShippingAddress,
//       }}
//       isAdmin={session?.user?.role === "admin" || false}
//     />
//   );
// };

// export default OrderDetailsPage;
