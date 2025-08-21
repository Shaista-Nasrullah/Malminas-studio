// FILE: app/user/layout.tsx

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";
// --- 1. Import the action to get the cart ---
import { getMyCart } from "@/lib/actions/cart.actions";

// --- 2. Convert the layout to an async function ---
export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- 3. Fetch the cart data on the server ---
  const cart = await getMyCart();

  // --- 4. Calculate the item count safely ---
  const cartItemCount = cart?.items.length || 0;

  return (
    <>
      <div className="flex flex-col">
        <div className="wrapper border-b container mx-auto">
          <div className="flex items-center h-15 px-4">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.png" // Note: your other layout used a different logo name, ensure this is correct
                height={98}
                width={98}
                alt={APP_NAME}
              />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              {/* --- 5. Pass the count prop to the Menu component --- */}
              <Menu count={cartItemCount} />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
