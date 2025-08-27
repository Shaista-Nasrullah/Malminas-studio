// FILE: components/shared/ShopByCategory.tsx

import { getHomepageCategories } from "@/lib/actions/category.actions";
import { PRIMARY_COLOR } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- 1. THIS IS THE FINAL FIX ---
// We define a simple, local type that EXACTLY matches the data returned
// by the getHomepageCategories() action.
type HomepageCategory = {
  id: string;
  name: string;
  slug: string;
  images: string[];
};

const ShopByCategory = async () => {
  const categories = await getHomepageCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-7" style={{ backgroundColor: PRIMARY_COLOR }}>
      <div className="wrapper mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-left mb-12">
          Shop By Category
        </h2>

        <div className="flex flex-nowrap gap-4 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 scrollbar-hide">
          {/* 2. We use our new, perfectly matching type here */}
          {categories.map((category: HomepageCategory) => (
            <Link
              href={`/collections/${category.slug}`}
              key={category.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex-shrink-0 basis-4/5 sm:basis-1/2 md:basis-auto"
            >
              <div className="relative w-full aspect-[4/3]">
                {category.images && category.images.length > 0 && (
                  <Image
                    src={category.images[0]}
                    alt={`Image for ${category.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                  {category.name}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
