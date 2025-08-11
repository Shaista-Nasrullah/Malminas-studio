import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[50vh] md:h-[75vh]">
      <Image
        src="/images/Malmina studio.png"
        alt="Beautiful Kuchi jewellery collection"
        fill
        // Try changing 'object-center' to one of these to see if it helps:
        // 'object-top' - Will always show the top of the image.
        // 'object-bottom' - Will always show the bottom.
        // 'object-left' - Will always show the far left.
        // 'object-right' - Will always show the far right.
        className="object-cover object-center" // <-- CHANGE THIS VALUE
        sizes="100vw"
        priority
      />
    </section>
  );
};

export default HeroSection;
