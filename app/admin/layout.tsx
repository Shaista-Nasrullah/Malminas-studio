// FILE: app/admin/layout.tsx

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";
// --- 1. Import the action to get the cart ---
import { getMyCart } from "@/lib/actions/cart.actions";

// --- 2. Convert the layout to an async function ---
export default async function AdminLayout({
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
        <div className="border-b container mx-auto">
          <div className="flex items-center h-25 px-4">
            <Link href="/" className="w-32">
              <Image
                src="/images/logo-remvedBg.png"
                height={88}
                width={120}
                alt={APP_NAME}
              />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              <AdminSearch />
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
