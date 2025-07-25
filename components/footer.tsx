import { getFooterCategories } from "@/lib/actions/category.actions";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  // Using more appropriate icons from react-icons
} from "lucide-react";
import { FaTiktok, FaPinterest } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { COPYRIGHT_HOLDER } from "@/lib/constants";

const Footer = async () => {
  const categories = await getFooterCategories();

  const FooterLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <li>
      <Link href={href} className="hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );

  return (
    <footer className="text-white/80" style={{ backgroundColor: "#998B20" }}>
      <div className="wrapper mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* --- Column 1: Brand Story & Subscribe --- */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/images/logo-removebg-preview.png"
                alt="Kuchi Jewels Logo"
                width={190}
                height={220}
              />
            </Link>
            {/* HIGHLIGHT: Replaced generic text with a brand mission statement */}
            <h3 className="text-lg font-bold text-white">
              Weaving Heritage into Every Thread
            </h3>
            <p className="text-sm">
              Discover the vibrant artistry of Pashtoon embroidery, a timeless
              tradition passed down through generations. Each piece in our
              collection is a testament to skillful hands and rich cultural
              heritage.
            </p>
            {/* Using a mix of icons for better brand representation */}
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube size={20} />
              </Link>
              <Link href="#" aria-label="TikTok">
                <FaTiktok size={20} />
              </Link>
              <Link href="#" aria-label="Pinterest">
                <FaPinterest size={20} />
              </Link>
            </div>
            {/* HIGHLIGHT: Changed the subscription call-to-action to be more thematic */}
            <h3 className="text-lg font-bold text-white pt-4">
              Follow the Thread of Tradition
            </h3>
            <form className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border border-white/50 rounded-full py-3 px-5 placeholder:text-white/70 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                aria-label="Subscribe"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* --- Column 2: Useful Links --- */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Useful Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/search">Search</FooterLink>
              {/* HIGHLIGHT: Changed "About Us" to "Our Story" to better fit the brand narrative */}
              <FooterLink href="/pages/about-us">About Us</FooterLink>
              <FooterLink href="/pages/shipping-policy">
                Shipping Policy
              </FooterLink>
              <FooterLink href="/pages/terms-and-conditions">
                Terms & Conditions
              </FooterLink>
              <FooterLink href="/pages/refund-and-return-policy">
                Refund and Return Policy
              </FooterLink>
              <FooterLink href="/pages/privacy-policy">
                Privacy Policy
              </FooterLink>
              <FooterLink href="/pages/faqs">FAQs</FooterLink>
            </ul>
          </div>

          {/* --- Column 3: Categories (Dynamic) --- */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <FooterLink
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                >
                  {category.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* --- Column 4: Contact --- */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Contact</h3>
            <div className="space-y-3 text-sm">
              <p>National Colony, Jaranwala Road, Faisalabad-Pakistan 38000</p>
              <a href="tel:+923150895511" className="block hover:text-white">
                +923150895511
              </a>
              <a
                href="mailto:sales@kuchijewels.com"
                className="block hover:text-white"
              >
                sales@MalminasTB.com
              </a>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-sm space-y-4 sm:space-y-0">
          <p>
            © {new Date().getFullYear()}, {COPYRIGHT_HOLDER} All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/pages/refund-policy" className="hover:text-white">
              Refund policy
            </Link>
            <Link href="/pages/privacy-policy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/pages/terms-of-service" className="hover:text-white">
              Terms of service
            </Link>
            <Link
              href="/pages/contact-information"
              className="hover:text-white"
            >
              Contact Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
