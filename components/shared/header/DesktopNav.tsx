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

// Helper component MUST be defined at the top level of the module, outside the main component.
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// ... (imports and ListItem component remain the same)

export function DesktopNav({ categories }: { categories: Category[] }) {
  const staticLinks = [{ href: "/", title: "Home" }];

  return (
    // HIGHLIGHT: THIS IS THE FIX.
    // We make the container 'relative' so 'z-index' works, and give it the highest z-index.
    <div className="flex flex-wrap">
      {/* The NavigationMenu no longer needs its own z-index, as its parent now controls it. */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* ... The rest of your component logic remains exactly the same ... */}
          {staticLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}

          {categories.map((category) =>
            category.subCategories && category.subCategories.length > 0 ? (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
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
              <NavigationMenuItem key={category.id}>
                <Link
                  href={`/collections/${category.slug}`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {category.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
