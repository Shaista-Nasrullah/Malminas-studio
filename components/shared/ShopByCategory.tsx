import { getHomepageCategories } from "@/lib/actions/category.actions";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ShopByCategory = async () => {
  // 1. Fetch the category data inside the server component
  const categories = await getHomepageCategories();

  if (categories.length === 0) {
    return null; // Don't render anything if there are no categories to show
  }

  return (
    // 2. The main section with your custom background color
    <section className="w-full py-9" style={{ backgroundColor: "#998B20" }}>
      <div className="wrapper mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-left mb-12">
          Shop By category
        </h2>

        {/* 3. The responsive grid for the category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              href={`/collections/${category.slug}`}
              key={category.id}
              className="group"
              legacyBehavior>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                {/* Image container */}
                <div className="relative w-full aspect-[4/3]">
                  {category.images && category.images.length > 0 && (
                    <Image
                      src={category.images[0]} // Use the first image of the category
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
