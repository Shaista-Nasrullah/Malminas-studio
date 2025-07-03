"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { name: "Date, new to old", value: "newest" },
  { name: "Date, old to new", value: "oldest" },
  { name: "Price, low to high", value: "lowest" },
  { name: "Price, high to low", value: "highest" },
];
const priceOptions = [
  { name: "Any Price", value: "all" },
  { name: "Under $50", value: "0-50" },
  { name: "$50 to $100", value: "50-100" },
];
const availabilityOptions = [
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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Always reset to page 1 when a filter changes
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Filter:</span>
        {/* Availability Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Availability <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availabilityOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilterChange("availability", option.value)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Price <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {priceOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilterChange("price", option.value)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {sortOptions.find((s) => s.value === currentSort)?.name ||
                "Relevance"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilterChange("sort", option.value)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-gray-500">{productCount} products</span>
      </div>
    </div>
  );
}
