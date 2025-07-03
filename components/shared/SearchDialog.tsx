"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to handle the 'Escape' key to close the dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Effect to focus the input when the dialog opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // Don't submit an empty query
    setIsOpen(false);
    router.push(`/search?q=${query}`);
  };

  return (
    <>
      {/* The Search Icon button that triggers the overlay */}
      {/* <Button
        variant="ghost"
        size="icon"
        aria-label="Open search"
        onClick={() => setIsOpen(true)}
        className="h-7 w-7"
      >
        <Search className="h-4 w-4" />
      </Button> */}
      <CiSearch size={26} />

      {/* The Search Overlay, conditionally rendered */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24"
          role="dialog"
          aria-modal="true"
        >
          {/* Background overlay with blur and dimming effect */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog content */}
          <div
            className="relative w-full max-w-lg transform px-4 transition-all"
            // Stop propagation so clicking inside the form doesn't close the dialog
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-14 w-full rounded-full border-2 pl-14 pr-20 text-lg"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <CiSearch className="h-6 w-6 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close search"
            className="absolute top-4 right-4 text-white hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
}
