"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"; // Still using for visual cues, can be removed if not needed
import React from "react";

// --- UPDATED: Standardized sort options ---
const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Avg. Customer Review", value: "rating-desc" },
];

// Price options
const priceOptions = [
  { name: "Any Price", value: "all" },
  { name: "Under Rs. 1000", value: "0-999" },
  { name: "Rs. 1000 to Rs. 5000", value: "1000-5000" },
  { name: "Rs. 5001 to Rs. 10000", value: "5001-10000" },
  { name: "Rs. 10001 to Rs. 40000", value: "10001-40000" },
  { name: "Rs. 40001 to Rs. 60000", value: "40001-60000" },
  { name: "Rs. 60001 to Rs. 80000", value: "60001-80000" },
  { name: "Rs. 80001 to Rs. 100000", value: "80001-100000" },
];

// Availability options
const availabilityOptions = [
  { name: "All", value: "all" }, // Added "All" for consistency and reset functionality
  { name: "In stock", value: "in-stock" },
  { name: "Out of stock", value: "out-of-stock" },
];

export function CollectionFilterBar({
  productCount,
}: {
  productCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // No longer strictly needed for display name on <select>, but useful for debugging
  // const getFilterDisplayName = (
  //   key: string,
  //   options:
  //     | typeof availabilityOptions
  //     | typeof priceOptions
  //     | typeof sortOptions
  // ) => {
  //   const currentValue = searchParams.get(key);
  //   const foundOption = options.find((option) => option.value === currentValue);
  //   if (foundOption) {
  //     return foundOption.name;
  //   }
  //   // Default to the first option if nothing is selected or an unknown value is present
  //   return options[0].name;
  // };

  const handleFilterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (value === "all" || value === "newest") {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }

    currentParams.delete("page"); // Always reset page to 1 when filters or sort change

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // Get current values for controlled <select> components
  const currentAvailability = searchParams.get("availability") || "all";
  const currentPrice = searchParams.get("price") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  // Tailwind CSS classes for basic select styling
  const selectClasses =
    "block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm";
  const arrowClasses =
    "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Filter:</span>

        {/* --- AVAILABILITY FILTER (NATIVE SELECT) --- */}
        <div className="relative">
          <select
            value={currentAvailability}
            onChange={(e) => handleFilterChange("availability", e.target.value)}
            className={selectClasses}
            style={{ minWidth: "120px" }}
          >
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
          <div className={arrowClasses}>
            <ChevronDown className="h-4 w-4" />{" "}
            {/* Using lucide-react icon for arrow */}
          </div>
        </div>

        {/* --- PRICE FILTER (NATIVE SELECT) --- */}
        <div className="relative">
          <select
            value={currentPrice}
            onChange={(e) => handleFilterChange("price", e.target.value)}
            className={selectClasses}
            style={{ minWidth: "150px" }}
          >
            {priceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
          <div className={arrowClasses}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Sort by:</span>
        {/* --- SORT BY FILTER (NATIVE SELECT) --- */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className={selectClasses}
            style={{ minWidth: "180px" }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
          <div className={arrowClasses}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <span className="text-gray-500">{productCount} products</span>
      </div>
    </div>
  );
}
