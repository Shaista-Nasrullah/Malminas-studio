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

  // --- 2. THIS IS THE FINAL FIX ---
  // We explicitly type the parameters in the reduce function.
  // 'acc' is the accumulator (a number), and 'item' is a CartItem.
  const itemsCount =
    cart?.items.reduce((acc: number, item: CartItem) => acc + item.qty, 0) || 0;

  const categories = (rawCategories as unknown) as Category[];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <TopHeader />
      <div className="w-full mx-auto">
        <div className="wrapper grid grid-cols-3 h-36 items-center">
          <div className="flex items-center justify-start gap-2 md:gap-3">
            <div className="lg:hidden">
              <CategoryDrawer categories={categories} />
            </div>
            <Search />
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              aria-label="Malminas Traditional Boutique Homepage"
            >
              <Image
                src="/images/logoo.png"
                alt="Malminas Traditional Boutique"
                height={150}
                width={180}
                priority={true}
              />
            </Link>
          </div>

          <div className="flex justify-end">
            <Menu count={itemsCount} />
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