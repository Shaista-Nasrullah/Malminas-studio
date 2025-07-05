"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Link from "next/link";
import { Category } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MenuIcon, X } from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok, FaPinterest } from "react-icons/fa";
import { Instagram } from "lucide-react";

export function CategoryDrawer({ categories }: { categories: Category[] }) {
  const socialLinks = [
    {
      label: "Facebook",
      icon: FaFacebook,
      href: "https://facebook.com",
    },
    {
      label: "Pinterest",
      icon: FaPinterest,
      href: "https://pinterest.com",
    },
    {
      label: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
    },
    {
      label: "Tiktok",
      icon: FaTiktok,
      href: "https://tiktok.com",
    },
    {
      label: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com",
    },
  ];
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Shop By Category</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            {categories.map((category) =>
              category.subCategories && category.subCategories.length > 0 ? (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger className="font-semibold">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col pl-4">
                      {/* --- UX IMPROVEMENT: Link to the parent category --- */}
                      <DrawerClose asChild>
                        <Link
                          href={`/collections/${category.slug}`}
                          className="p-2 font-medium rounded-md hover:bg-accent"
                          legacyBehavior>
                          All {category.name}
                        </Link>
                      </DrawerClose>

                      {category.subCategories.map((sub) => (
                        <DrawerClose asChild key={sub.id}>
                          {/* --- FIX #1: Correct URL for sub-categories --- */}
                          <Link
                            href={`/collections/${category.slug}?subcategory=${sub.slug}`}
                            className="p-2 rounded-md hover:bg-accent"
                            legacyBehavior>
                            {sub.name}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <DrawerClose asChild key={category.id}>
                  {/* --- FIX #2: Correct syntax for parent categories --- */}
                  <Link
                    href={`/collections/${category.slug}`}
                    className="flex w-full items-center py-4 font-semibold border-b"
                    legacyBehavior>
                    {category.name}
                  </Link>
                </DrawerClose>
              )
            )}
          </Accordion>
        </div>
        {/* --- 3. FOOTER SECTION (Updated) --- */}
        <footer className="mt-auto p-6 bg-gray-50 border-t">
          {/* HIGHLIGHT: 3. Dynamically render icons by mapping over the socialLinks array */}
          <div className="flex items-center justify-between">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={`Visit our ${social.label} page`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </footer>
      </DrawerContent>
    </Drawer>
  );
}
