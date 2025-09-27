// FILE: components/shared/header/index.tsx

import Image from "next/image";
import Link from "next/link";
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { DesktopNav } from "./DesktopNav";
import { CategoryDrawer } from "./category-drawer";
import Menu from "./menu";
import Search from "./search";
import { TopHeader } from "./top-header";
// --- 1. IMPORT THE TYPES ---
import { Category, CartItem } from "@/types";

const Header = async () => {
  const rawCategories = await getCategoriesForNavigation();
  const cart = await getMyCart();

  const itemsCount =
    cart?.items.reduce((acc: number, item: CartItem) => acc + item.qty, 0) || 0;

  const categories = rawCategories as unknown as Category[];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <TopHeader />
      <div className="w-full mx-auto">
        {/* Responsive height on mobile (5rem) and md+ (9rem) */}
        <div className="flex items-center justify-between h-25 md:h-36 px-4 sm:px-6 md:px-8 max-w-screen-xl mx-auto pt-3">
          {/* Left group: menu icon + search */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <CategoryDrawer categories={categories} />
            </div>
            <Search />
          </div>

          {/* Center logo */}
          <div className="flex justify-center flex-grow">
            <Link href="/" aria-label="Malminas Traditional Wear Homepage">
              <Image
                src="/images/logoo.png"
                alt="Malminas Traditional Wear"
                height={65}
                width={145}
                priority={true}
              />
            </Link>
          </div>

          {/* Right group: cart and user icon */}
          <div className="flex items-center gap-6">
            <Menu count={itemsCount} />
            {/* If you have a user icon, add it here */}
            {/* Example:
                <UserIcon />
            */}
          </div>
        </div>

        <nav className="hidden h-12 items-center justify-center lg:flex">
          <DesktopNav categories={categories} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
