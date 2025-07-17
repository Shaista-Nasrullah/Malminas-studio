// app/checkout/page.tsx

import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/signin?redirect=/checkout");
  }

  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    return redirect("/cart");
  }

  const user = await getUserById(session.user.id as string);

  return (
    <div className="min-h-screen font-sans">
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="py-8 px-4 sm:px-6 lg:px-20 xl:px-32">
          <div className="mx-auto max-w-lg">
            <CheckoutForm
              user={{
                email: user.email!,
                address: user.address,
                paymentMethod: user.paymentMethod,
              }}
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="hidden lg:block sticky top-0 h-screen border-l border-gray-200 bg-gray-50/75">
          <div className="py-1 px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="flex align-center justify-center h-auto bg-gray-50">
              <Link href="/" className="mb-1 block">
                <Image
                  src="/images/logo-removebg-preview.png"
                  width={150} // Slightly larger logo
                  height={50}
                  alt="Kuchi"
                />
              </Link>
            </div>

            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
