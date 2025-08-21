// FILE: app/(checkout)/checkout/page.tsx

import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ContactInformation from "@/components/checkout/ContactInformation";
import CheckoutFooter from "@/components/FooterLinks";

// --- ADDED ---: A specific type for the user's shipping address
type ShippingAddress = {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  lat?: number;
  lng?: number;
};

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
    // This part remains the same
    userData = { id: null, email: "", address: null, paymentMethod: null };
  }

  // --- ADDED ---: A type assertion to fix the Prisma JSON type issue
  // We are telling TypeScript: "Treat this generic JSON value as our specific ShippingAddress type."
  const userAddress = userData.address
    ? (userData.address as ShippingAddress)
    : null;

  return (
    <div className="wrapper grid grid-cols-1 lg:grid-cols-2">
      <div className="py-8 px-4 sm:px-6 lg:py-12 lg:px-20 xl:px-10 bg-white">
        <div className="mx-auto max-w-lg">
          <div className="lg:hidden -mx-4 sm:-mx-6 mb-6">
            <OrderSummary />
          </div>
          <div className="space-y-6">
            <ContactInformation />
            <hr className="border-gray-200" />
            <CheckoutForm
              user={{
                id: userData.id,
                email: userData.email || "",
                // --- UPDATED ---: Use the new, correctly typed address variable
                address: userAddress,
                paymentMethod: userData.paymentMethod,
              }}
            />
            <CheckoutFooter />
          </div>
        </div>
      </div>
      <div className="hidden lg:block sticky top-0 h-screen border-l border-gray-200 bg-gray-50/75 p-6 lg:p-6 xl:p-12">
        <OrderSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;
