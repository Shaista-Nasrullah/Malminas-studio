"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const links = [
  { title: "Overview", href: "/admin/overview" },
  { title: "Products", href: "/admin/products" },
  { title: "Categories", href: "/admin/categories" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Users", href: "/admin/users" },
  { title: "Pages", href: "/admin/pages" },
  { title: "Announcements", href: "/admin/announcement" },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={cn("relative", className)} {...props}>
      {/* Hamburger toggle button for mobile */}
      <button
        className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Desktop (large screen) horizontal menu */}
      <div className="hidden lg:flex items-center space-x-6">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(item.href)
                ? "text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setMenuOpen(false)}
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-70 bg-blue-100 rounded-md shadow-lg flex flex-col lg:hidden z-[9999] divide-y divide-gray-200">
          {links.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-6 py-4 text-base font-semibold hover:bg-gray-100 transition-colors",
                pathname.includes(item.href) ? "text-primary" : "text-gray-800",
                // Prevent extra border on last item
                idx === links.length - 1 ? "" : "border-b border-gray-200"
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default MainNav;
