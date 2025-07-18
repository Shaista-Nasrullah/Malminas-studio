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
// --- 1. IMPORT THE NEW COMPONENT ---
import ContactInformation from "@/components/checkout/ContactInformation";
import CheckoutFooter from "@/components/FooterLinks";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    return redirect("/cart");
  }

  const session = await auth();
  let userData;

  if (session?.user?.id) {
    userData = await getUserById(session.user.id);
  } else {
    // This is the placeholder for a guest
    userData = {
      id: null,
      email: "",
      address: null,
      paymentMethod: null,
    };
  }

  return (
    <div className="font-sans">
      <div className="wrapper relative grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="py-8 px-4 sm:px-6 lg:px-20 xl:px-10">
          {/* --- 2. ADD A CONTAINER WITH VERTICAL SPACING --- */}
          <div className="mx-auto max-w-lg space-y-6">
            {/* The OrderSummary for mobile is often placed here */}
            {/* You can add a mobile-only order summary if needed */}

            {/* --- 3. USE THE NEW COMPONENT --- */}
            <ContactInformation />

            {/* --- 4. ADD A DIVIDER FOR VISUAL SEPARATION --- */}
            <hr className="border-gray-200" />

            <CheckoutForm
              user={{
                id: userData.id,
                email: userData.email || "",
                address: userData.address,
                paymentMethod: userData.paymentMethod,
              }}
            />
            <CheckoutFooter />
          </div>
        </div>
        {/* Right Column: Order Summary */}
        <div className="hidden lg:block sticky top-0 h-screen border-l border-gray-200 bg-gray-50/75">
          <div className="py-8 px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  width={150}
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
