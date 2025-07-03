import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import UserButton from "./user-button";

const Menu = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <nav className="flex items-center gap-2 md:gap-3">
        <Link
          href="/cart"
          aria-label={`Shopping Cart with ${count} items`}
          className="relative"
        >
          <HiOutlineShoppingBag size={26} />

          {count > 0 && (
            <span
              key={count} // Adding a key makes the animation re-trigger on change
              className="absolute -top-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-in fade-in-0 zoom-in-75"
            >
              {count}
            </span>
          )}
        </Link>
        <UserButton />
      </nav>
    </div>
  );
};

export default Menu;
