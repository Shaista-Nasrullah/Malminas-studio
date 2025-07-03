// components/AnnouncementBanner.tsx
import type { FC } from "react";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok, FaPinterest } from "react-icons/fa";

const AnnouncementBanner: FC = () => {
  const socialLinks = [
    { label: "Facebook", icon: FaFacebook, href: "https://facebook.com" },
    { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { label: "YouTube", icon: FaYoutube, href: "https://youtube.com" },
    { label: "Tiktok", icon: FaTiktok, href: "https://tiktok.com" },
    { label: "Pinterest", icon: FaPinterest, href: "https://pinterest.com" },
  ];

  return (
    <header className="bg-[#998B20] text-white w-full h-10 flex items-center">
      {/* HIGHLIGHT 1: Layout changes to be 1 column on mobile, 3 on large screens */}
      <div className="wrapper mx-auto grid grid-cols-1 lg:grid-cols-3 items-center py-2 px-4 sm:px-6 lg:px-8 text-sm">
        {/* HIGHLIGHT 2: Social icons are now hidden by default and appear as a flex container on large screens */}
        <div className="hidden lg:flex items-center gap-5 justify-self-start">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={`Visit our ${social.label} page`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <social.icon className="h-4 w-4" strokeWidth={2} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 justify-self-center whitespace-nowrap">
          <button
            aria-label="Previous Announcement"
            className="hover:opacity-75 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <span className="font-semibold tracking-wider text-center text-xs sm:text-sm">
            SUMMER SALE GET UPTO 30% OFF
          </span>
          <button
            aria-label="Next Announcement"
            className="hover:opacity-75 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="hidden lg:block justify-self-end"></div>
      </div>
    </header>
  );
};

export default AnnouncementBanner;
