import { getHomepageCategories } from "@/lib/actions/category.actions";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ShopByCategory = async () => {
  const categories = await getHomepageCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-9" style={{ backgroundColor: "#998B20" }}>
      <div className="wrapper mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-left mb-12">
          Shop By category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            // --- THIS IS THE FIX ---
            // 1. legacyBehavior is removed.
            // 2. All classes from the inner <div> are moved here.
            <Link
              href={`/collections/${category.slug}`}
              key={category.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
            >
              {/* The outer <div> is no longer needed. The children are now direct children of <Link> */}
              {/* Image container */}
              <div className="relative w-full aspect-[4/3]">
                {category.images && category.images.length > 0 && (
                  <Image
                    src={category.images[0]}
                    alt={`Image for ${category.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              {/* Text content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                  {category.name}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </h3>
              </div>
            </Link>
            // --- END OF FIX ---
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
