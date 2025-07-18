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
    <section className="w-full py-7" style={{ backgroundColor: "#998B20" }}>
      <div className="wrapper mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-left mb-12">
          Shop By Category
        </h2>

        {/* --- START OF CHANGES --- */}
        {/*
          This container is now a flexbox on mobile and a grid on medium screens and up.
          - `flex`:       Establishes a flex container.
          - `flex-nowrap`:  Forces all items into a single row, preventing wrapping.
          - `gap-4`:        Sets space between items (you can adjust from gap-8).
          - `overflow-x-auto`:  Enables horizontal scrolling.
          - `scrollbar-hide`: (Optional) A common utility to hide the scrollbar visually.
          - `md:grid`:      At the medium breakpoint, switch the layout back to a grid.
          - `md:grid-cols-2 lg:grid-cols-3`:  Your original responsive grid columns.
          - `md:gap-8`:       Use a larger gap on the grid layout.
        */}
        <div className="flex flex-nowrap gap-4 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 scrollbar-hide">
          {categories.map((category) => (
            /*
              Each item needs a defined size to work correctly in the flex container.
              - `flex-shrink-0`: Prevents the item from shrinking to fit.
              - `basis-4/5`:   Sets the initial width of the item to 80% of the container.
                               This creates the effect of seeing the next item "peeking" out.
              - `sm:basis-1/2`: On slightly larger small screens, show two items.
              - `md:basis-auto`: When the layout switches to grid, let the grid control the size.
            */
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
        {/* --- END OF CHANGES --- */}
      </div>
    </section>
  );
};

export default ShopByCategory;
