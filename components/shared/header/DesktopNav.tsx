"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// --- FIX #1: Update ListItem to use <Link> instead of <a> ---
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>, // Changed from "a" to typeof Link
  React.ComponentPropsWithoutRef<typeof Link> // Changed from "a" to typeof Link
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        {/* Replaced the <a> tag with a Next.js <Link> component */}
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function DesktopNav({ categories }: { categories: Category[] }) {
  const staticLinks = [{ href: "/", title: "Home" }];

  return (
    <div className="flex flex-wrap">
      <NavigationMenu>
        <NavigationMenuList>
          {/* --- FIX #2: Update static links --- */}
          {staticLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              {/* Use the 'asChild' pattern */}
              <NavigationMenuLink asChild>
                <Link href={link.href} className={navigationMenuTriggerStyle()}>
                  {link.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {categories.map((category) =>
            category.subCategories && category.subCategories.length > 0 ? (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* This part now works correctly because ListItem was fixed above */}
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[1200px] align-start">
                    <ListItem
                      key={category.id}
                      href={`/collections/${category.slug}`}
                      title={`All ${category.name}`}
                      className="md:col-span-2 bg-accent/50"
                    >
                      Browse all products in this collection.
                    </ListItem>
                    {category.subCategories.map((sub) => (
                      <ListItem
                        key={sub.id}
                        href={`/collections/${category.slug}?subcategory=${sub.slug}`}
                        title={sub.name}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              // --- FIX #3: Update simple category links ---
              <NavigationMenuItem key={category.id}>
                {/* Use the 'asChild' pattern here as well */}
                <NavigationMenuLink asChild>
                  <Link
                    href={`/collections/${category.slug}`}
                    className={navigationMenuTriggerStyle()}
                  >
                    {category.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
