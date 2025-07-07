import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import UserButton from "./user-button";

const Menu = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <nav className="flex items-center gap-2 md:gap-3">
        {/* --- Start of Changes --- */}
        <Link
          href="/cart"
          aria-label={`Shopping Cart with ${count} items`}
          // The className="relative" stays here, as <Link> is the positioning parent
          className="relative"
          // legacyBehavior prop is now removed
        >
          {/*
            A single wrapper to group the icon and the badge.
            This satisfies the "one child" rule of the new <Link> component.
          */}
          <span>
            <HiOutlineShoppingBag size={26} />

            {count > 0 && (
              <span
                key={count} // Key for animation
                // These classes work because the parent <Link> is `relative`
                className="absolute -top-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-in fade-in-0 zoom-in-75"
              >
                {count}
              </span>
            )}
          </span>
        </Link>
        {/* --- End of Changes --- */}

        <UserButton />
      </nav>
    </div>
  );
};

export default Menu;
