import Image from "next/image";

const HeroSection = () => {
  return (
    // HIGHLIGHT: Removed the `z-1` class.
    // The section is still 'relative' so the 'fill' prop on the Image works correctly.
    <section className="relative w-full h-[50vh] md:h-[75vh]">
      <Image
        src="/images/banner-3.png"
        alt="Beautiful Kuchi jewellery collection"
        fill
        className="object-cover"
        priority
      />
    </section>
  );
};

export default HeroSection;
