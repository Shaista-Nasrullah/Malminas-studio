import Image from "next/image";
import Link from "next/link";

// Server-side data fetching
import { getCategoriesForNavigation } from "@/lib/actions/category.actions";
import { getMyCart } from "@/lib/actions/cart.actions";

// Responsive Navigation Components
import { DesktopNav } from "./DesktopNav";
import { CategoryDrawer } from "./category-drawer";
import AnnouncementBanner from "./top-header";
import Menu from "./menu";
import Search from "./search";

const Header = async () => {
  const categories = await getCategoriesForNavigation();
  const cart = await getMyCart();
  const itemsCount = cart?.items.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <AnnouncementBanner />
      <div className="w-full mx-auto">
        <div className="wrapper grid grid-cols-3 h-36 items-center">
          {/* --- Left Section --- */}
          <div className="flex items-center justify-start gap-2 md:gap-3">
            <div className="lg:hidden">
              <CategoryDrawer categories={categories} />
            </div>
            <Search />
          </div>

          {/* --- Center Section: Logo (FIXED) --- */}
          <div className="flex justify-center">
            {/* The only change is removing the legacyBehavior prop */}
            <Link
              href="/"
              aria-label="Malminas Traditional Boutique Homepage"
              // legacyBehavior prop is now removed
            >
              <Image
                src="/images/logo-remvedBg.png"
                alt="Malminas Traditional Boutique"
                height={150}
                width={180}
                priority={true}
              />
            </Link>
          </div>

          {/* --- Right Section: User and Cart Icons --- */}
          <div className="flex justify-end">
            <Menu count={itemsCount} />
          </div>
        </div>

        {/* --- BOTTOM ROW: Desktop Navigation --- */}
        <nav className="hidden h-12 items-center justify-center lg:flex">
          <DesktopNav categories={categories} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
