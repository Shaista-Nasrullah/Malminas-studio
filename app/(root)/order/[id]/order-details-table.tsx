// order-confirmation-display.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types";
import { formatCurrency, formatId } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
// import OrderMap from "./OrderMap";
// import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import { Button } from "@/components/ui/button";
import OrderMap from "@/components/OrderMap";
import CheckoutFooter from "@/components/FooterLinks";

const OrderConfirmationDisplay = ({ order }: { order: Order }) => {
  const {
    id,
    shippingAddress,
    paymentMethod,
    orderitems,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = order;

  const fullAddressString = `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

  return (
    <div className="wrapper grid grid-cols-1 lg:grid-cols-2">
      {/* --- LEFT COLUMN --- */}
      <div className="py-8 sm:px-6 lg:py-16 lg:px-2 xl:px-2">
        <div className="mx-auto max-w-lg space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Order {formatId(id)}</p>
              <h1 className="text-2xl font-semibold text-gray-900">
                Thank you, {shippingAddress.fullName.split(" ")[0]}!
              </h1>
            </div>
          </div>

          {/* Map */}
          <OrderMap address={fullAddressString} />

          {/* Order Details Card */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Order details</h2>
            <div className="mt-4 space-y-6">
              {/* Contact & Payment */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-800">
                    Contact information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.user.email}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Payment method</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {paymentMethod} - {formatCurrency(totalPrice)}
                  </p>
                </div>
              </div>
              {/* Shipping & Billing */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-800">
                    Shipping address
                  </h3>
                  <address className="mt-1 not-italic text-sm text-gray-600">
                    {shippingAddress.fullName}
                    <br />
                    {shippingAddress.streetAddress}
                    <br />
                    {shippingAddress.city}, {shippingAddress.postalCode}
                    <br />
                    {shippingAddress.country}
                  </address>
                </div>
                {/* <div>
                  <h3 className="font-medium text-gray-800">Billing address</h3>
                  <address className="mt-1 not-italic text-sm text-gray-600">
                    {shippingAddress.fullName}
                    <br />
                    {shippingAddress.streetAddress}
                    <br />
                    {shippingAddress.city}, {shippingAddress.postalCode}
                    <br />
                    {shippingAddress.country}
                  </address>
                </div> */}
                <div>
                  <h3 className="font-medium text-gray-800">Shipping method</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Standard Shipping
                  </p>
                </div>
              </div>
              {/* Shipping Method */}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/contact" className="text-[#998B20] hover:underline">
                Contact us
              </Link>
            </p>
            <Button
              asChild
              style={{ backgroundColor: "#998B20" }}
              className="hover:bg-[#998B20]/90"
            >
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
          <CheckoutFooter />
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className=" hidden lg:block sticky top-0 h-screen border-l bg-gray-50 px-4">
        <div className="py-16 space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                width={100}
                height={35}
                alt="Kuchi Jewels"
              />
            </Link>
          </div>
          {/* Order Items */}
          <ul role="list" className="divide-y divide-gray-200">
            {orderitems.map((item) => (
              <li key={item.slug} className="flex items-center py-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <span
                    className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center 
           rounded-full bg-gray-700 text-xs font-medium text-white"
                  >
                    {item.qty}
                  </span>
                </div>
                <div className="ml-4 flex-1 text-sm">
                  <p className="font-medium text-gray-800">{item.name}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatCurrency(item.price)}
                </p>
              </li>
            ))}
          </ul>
          {/* Totals */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>{formatCurrency(itemsPrice)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Shipping</p>
              <p>{formatCurrency(shippingPrice)}</p>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <p>Total</p>
              <p>PKR {formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationDisplay;
