// app/(root)/order/[id]/page.tsx

import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound, redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import OrderConfirmationDisplay from "./order-details-table";
// We no longer import the display component here, we can use the original name
// import OrderConfirmationDisplay from "./order-confirmation-display";

export const metadata: Metadata = {
  title: "Thank You For Your Order",
};

// Fix for Next.js 15
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  // We are no longer translating anything here.
  // We just pass the entire order object directly to the display component.
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

// // app/orders/[id]/page.tsx

// import { Metadata } from "next";
// import { getOrderById } from "@/lib/actions/order.actions";
// import { notFound, redirect } from "next/navigation";
// import { ShippingAddress } from "@/types";
// import { auth } from "@/auth";
// import OrderConfirmationDisplay from "./order-details-table";
// // --- 1. RENAME THE IMPORTED COMPONENT ---
// // import OrderConfirmationDisplay from "./order-confirmation-display";

// export const metadata: Metadata = {
//   title: "Thank You For Your Order",
// };

// const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
//   const { id } = await props.params;

//   const order = await getOrderById(id);
//   if (!order) notFound();

//   const session = await auth();

//   // IMPORTANT: For security, you should re-enable this check
//   if (order.userId !== session?.user.id && session?.user.role !== "admin") {
//     return redirect("/unauthorized");
//   }

//   // --- 2. RENDER THE NEW COMPONENT ---
//   // The isAdmin prop is not needed for the customer view.
//   return (
//     <OrderConfirmationDisplay
//       order={{
//         ...order,
//         shippingAddress: order.shippingAddress as ShippingAddress,
//       }}
//     />
//   );
// };

// export default OrderDetailsPage;
