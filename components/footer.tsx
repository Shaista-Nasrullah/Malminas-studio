import { getFooterCategories } from "@/lib/actions/category.actions";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react"; // Note: Using Twitter for Pinterest/TikTok as placeholders
import Image from "next/image";
import Link from "next/link";

const Footer = async () => {
  // 1. Fetch the dynamic category links
  const categories = await getFooterCategories();

  // Helper component for list items to reduce repetition
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
    // 2. Main footer container with the correct background color
    <footer className="text-white/80" style={{ backgroundColor: "#998B20" }}>
      <div className="wrapper mx-auto px-4 pt-16 pb-8">
        {/* Main grid for the footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info & Subscribe */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/images/logo-removebg-preview.png"
                alt="Kuchi Jewels Logo"
                width={150}
                height={150}
              />
            </Link>
            <h3 className="text-lg font-bold text-white">
              Welcome to Kuchijewels PAKISTAN
            </h3>
            <p className="text-sm">
              Online store of Afghan Kuchi Tribal, Pakistani, Indian & Nepali
              Jewelry, accessories & cloth
            </p>
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
              <Link href="#" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
            </div>
            <h3 className="text-lg font-bold text-white pt-4">
              Subscribe to our emails
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

          {/* Column 2: Useful Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Useful Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/search">Search</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/policies/shipping">Shipping Policy</FooterLink>
              <FooterLink href="/policies/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/policies/refund">
                Refund and Return Policy
              </FooterLink>
              <FooterLink href="/policies/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
            </ul>
          </div>

          {/* Column 3: Categories (Dynamic) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <FooterLink
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                >
                  {category.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
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
                sales@kuchijewels.com
              </a>
              <a
                href="mailto:kuchijewels@gmail.com"
                className="block hover:text-white"
              >
                kuchijewels@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-sm space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()}, Kuchijewels Pk</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/policies/refund" className="hover:text-white">
              Refund policy
            </Link>
            <Link href="/policies/privacy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/policies/terms" className="hover:text-white">
              Terms of service
            </Link>
            <Link href="/policies/shipping" className="hover:text-white">
              Shipping policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import { APP_NAME } from "@/lib/constants";

// const Footer = () => {
//   const currentYear = new Date().getFullYear();
//   return (
//     <>
//       <footer className="border-t">
//         <div className="p-5 flex-center">
//           {currentYear} {APP_NAME}. All Rights Reserved
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;
