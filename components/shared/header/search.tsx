"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  return (
    <>
      {/* 1. This is the initial search icon in your header */}
      {/* <Button onClick={openSearch} variant="ghost">
        <SearchIcon size={26} />
        <span className="sr-only">Open search</span>
      </Button> */}
      <button
        type="button" // Good practice to prevent accidental form submission
        onClick={openSearch}
        // Add classes to make it look and feel like a ghost button
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Open search" // Use aria-label for accessibility on icon-only buttons
      >
        <SearchIcon size={24} />
      </button>

      {/* 2. Render the overlay and search bar ONLY when isOpen is true */}
      {isOpen && (
        <>
          {/* The full-screen, semi-transparent backdrop */}
          {/* It has a lower z-index than the search bar */}
          <div
            className="fixed inset-0 z-40 bg-black/40 animate-in fade-in-0"
            onClick={closeSearch} // Close search when clicking the backdrop
          />

          {/* The full-width white search bar at the top */}
          {/* It has a higher z-index to appear on top of the backdrop */}
          <div className="fixed top-10 left-0 right-0 h-50 z-50 bg-white shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-center justify-center h-50 gap-3.5">
              {/* The form with the expanding input field */}
              <form
                action="/search"
                method="GET"
                className="flex items-center justify-center"
              >
                <Input
                  name="q"
                  type="text"
                  placeholder="Search..."
                  // Note the styling: rounded but not a full pill, with padding for the icon
                  className="h-12 lg:w-150 md:w-80 sm:60 rounded-lg border-2 bg-background text-base shadow-none m-auto"
                  autoFocus
                />
              </form>

              {/* The "X" button to close */}
              <Button
                onClick={closeSearch}
                variant="ghost"
                size="icon"
                className="h-12 w-12 shrink-0"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Search;
