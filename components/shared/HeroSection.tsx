import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[50vh] md:h-[75vh]">
      <Image
        src="/images/Malmina studio.png"
        alt="Beautiful Kuchi jewellery collection"
        fill
        className="object-cover object-top md:object-center"
        sizes="100vw"
        priority
      />
    </section>
  );
};

export default HeroSection;
