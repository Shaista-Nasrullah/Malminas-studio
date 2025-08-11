// components/checkout/OrderSummary.tsx

import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

// This is the SVG code for a shopping cart icon. It's now part of our component.
const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const OrderSummary = async ({ order }: { order?: Order }) => {
  let source;

  if (order) {
    source = {
      items: order.orderitems,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
    };
  } else {
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return null;
    }
    source = {
      items: cart.items,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    };
  }

  const SummaryContent = () => (
    <div className="space-y-6">
      <div className="hidden lg:flex justify-center mb-8">
        <Link href="/">
          <Image src="/images/logo.png" width={150} height={50} alt="Kuchi" />
        </Link>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {source.items.map((item, index) => (
          <li key={index} className="flex items-center py-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white">
                {item.qty}
              </span>
            </div>
            <div className="ml-4 flex-1 text-sm">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(Number(item.price) * item.qty)}
            </p>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <p>Subtotal</p>
          <p>{formatCurrency(source.itemsPrice)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Shipping</p>
          <p>{formatCurrency(source.shippingPrice)}</p>
        </div>
        <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
          <p>Total</p>
          <p>PKR {formatCurrency(source.totalPrice)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* MOBILE COLLAPSIBLE SECTION */}
      {/* <div className="hidden lg:flex justify-center mb-8">
        <Link href="/">
          <Image src="/images/logo.png" width={150} height={50} alt="Kuchi" />
        </Link>
      </div> */}
      <div className="lg:hidden bg-gray-100 border-t border-b">
        <details className="group">
          <summary className="p-4 flex justify-between items-center font-semibold cursor-pointer list-none">
            <div className="flex items-center gap-2 text-[#998B20]">
              {/* --- We now use our safe SVG icon --- */}
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Show order summary</span>
            </div>
            <span className="group-open:hidden">
              {formatCurrency(source.totalPrice)}
            </span>
            <span className="hidden group-open:inline font-normal text-sm">
              Hide
            </span>
          </summary>
          <div className="p-4 bg-white border-t">
            <SummaryContent />
          </div>
        </details>
      </div>

      {/* DESKTOP-ONLY VIEW */}
      <div className="hidden lg:block">
        <SummaryContent />
      </div>
    </div>
  );
};

export default OrderSummary;

// // components/checkout/OrderSummary.tsx

// import { getMyCart } from "@/lib/actions/cart.actions";
// import { formatCurrency } from "@/lib/utils";
// import Image from "next/image";
// import { redirect } from "next/navigation";

// const OrderSummary = async () => {
//   const cart = await getMyCart();
//   if (!cart || cart.items.length === 0) {
//     return redirect("/cart");
//   }

//   return (
//     <div className="space-y-6">
//       {/* --- Items List --- */}
//       <ul role="list" className="divide-y divide-gray-200">
//         {cart.items.map((item) => (
//           <li key={item.slug} className="flex items-center py-4">
//             {/* 1. The container must be `relative` for the badge to be positioned correctly. */}
//             <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
//               <Image
//                 src={item.image}
//                 alt={item.name}
//                 fill
//                 className="object-cover object-center"
//               />
//               {/* 2. This is the precisely styled badge */}
//               <span
//                 className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center
//            rounded-full bg-gray-700 text-xs font-medium text-white"
//               >
//                 {item.qty}
//               </span>
//             </div>

//             <div className="ml-4 flex flex-1 flex-col text-sm">
//               <h3 className="font-medium text-gray-900">{item.name}</h3>
//               {/* Optional: Add color/size if available */}
//               {item.color && <p className="text-gray-500">{item.color}</p>}
//               {/* I'm assuming you have a way to generate this */}
//               <p className="text-gray-500 text-xs mt-1">
//                 Estimated Delivery Time: 23/07/2025
//               </p>
//             </div>
//             <p className="text-sm font-medium text-gray-900">
//               {formatCurrency(item.price * item.qty)}
//             </p>
//           </li>
//         ))}
//       </ul>

//       <div className="space-y-2 border-t border-gray-200 pt-6">
//         <div className="flex items-center justify-between text-sm">
//           <dt className="text-gray-600">Subtotal</dt>
//           <dd className="font-medium text-gray-900">
//             {formatCurrency(cart.itemsPrice)}
//           </dd>
//         </div>
//         <div className="flex items-center justify-between text-sm">
//           <dt className="text-gray-600">Shipping</dt>
//           <dd className="font-medium text-gray-900">
//             {formatCurrency(cart.shippingPrice)}
//           </dd>
//         </div>
//         <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
//           <dt className="text-gray-900">Total</dt>
//           <dd className="text-gray-900">{formatCurrency(cart.totalPrice)}</dd>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;
