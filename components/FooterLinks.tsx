// components/checkout/CheckoutFooter.tsx

import Link from "next/link";

// An array to hold our link data, making it easy to manage
const footerLinks = [
  { href: "/pages/refund-policy", text: "Refund policy" },
  { href: "/pages/shipping-policy", text: "Shipping policy" },
  { href: "/pages/privacy-policy", text: "Privacy policy" },
  { href: "/pages/terms-of-service", text: "Terms of service" },
  { href: "/pages/contact", text: "Contact information" },
];

const CheckoutFooter = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {/* A flex container that wraps links and centers them */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {footerLinks.map((link) => (
          <Link
            key={link.text}
            href={link.href}
            // Using your brand color for the links
            className="text-sm text-[#998B20] hover:text-[#998B20]/80"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CheckoutFooter;
