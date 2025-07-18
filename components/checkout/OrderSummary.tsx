// components/checkout/OrderSummary.tsx

import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

const OrderSummary = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    return redirect("/cart");
  }

  return (
    <div className="space-y-6">
      {/* --- Items List --- */}
      <ul role="list" className="divide-y divide-gray-200">
        {cart.items.map((item) => (
          <li key={item.slug} className="flex items-center py-4">
            {/* 1. The container must be `relative` for the badge to be positioned correctly. */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover object-center"
              />
              {/* 2. This is the precisely styled badge */}
              <span
                className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center 
           rounded-full bg-gray-700 text-xs font-medium text-white"
              >
                {item.qty}
              </span>
            </div>

            <div className="ml-4 flex flex-1 flex-col text-sm">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              {/* Optional: Add color/size if available */}
              {item.color && <p className="text-gray-500">{item.color}</p>}
              {/* I'm assuming you have a way to generate this */}
              <p className="text-gray-500 text-xs mt-1">
                Estimated Delivery Time: 23/07/2025
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(item.price * item.qty)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium text-gray-900">
            {formatCurrency(cart.itemsPrice)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900">
            {formatCurrency(cart.shippingPrice)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
          <dt className="text-gray-900">Total</dt>
          <dd className="text-gray-900">{formatCurrency(cart.totalPrice)}</dd>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
