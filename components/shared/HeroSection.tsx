import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[50vh] md:h-[75vh]">
      <Image
        src="/images/banner-3.png"
        alt="Beautiful Kuchi jewellery collection"
        fill
        // HIGHLIGHT 1: Control the crop focus
        // By default, it's 'object-center'. You can change it to 'object-top',
        // 'object-bottom', etc., to keep important parts of the image in view.
        className="object-cover object-center" // 'object-center' is default, but it's good to be explicit.
        // HIGHLIGHT 2: Optimize image loading with the 'sizes' prop.
        // This gives a hint to the browser about the image's size on different screens,
        // helping it download the most optimal version.
        sizes="100vw"
        priority
      />
    </section>
  );
};

export default HeroSection;
