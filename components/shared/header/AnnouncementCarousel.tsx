// In components/shared/header/AnnouncementCarousel.tsx
"use client"; // This is now the Client Component

import { useEffect, useState, type FC } from "react";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok, FaPinterest } from "react-icons/fa";
import { type Announcement } from "@prisma/client";

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

export const AnnouncementCarousel: FC<AnnouncementCarouselProps> = ({
  announcements,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const socialLinks = [
    { label: "Facebook", icon: FaFacebook, href: "https://facebook.com" },
    { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { label: "YouTube", icon: FaYoutube, href: "https://youtube.com" },
    { label: "Tiktok", icon: FaTiktok, href: "https://tiktok.com" },
    { label: "Pinterest", icon: FaPinterest, href: "https://pinterest.com" },
  ];

  // --- AUTO-PLAY LOGIC ---
  useEffect(() => {
    // Don't start a timer if there's only one (or zero) announcements
    if (announcements.length <= 1) return;

    // Set up an interval to change the announcement every 5 seconds (5000 milliseconds)
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    // This is a cleanup function. It runs when the component is unmounted
    // to prevent memory leaks.
    return () => clearInterval(timer);
  }, [announcements.length]); // Re-run the effect if the number of announcements changes

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#998B20] text-white w-full h-10 flex items-center">
      <div className="wrapper mx-auto grid grid-cols-1 lg:grid-cols-3 items-center py-2 px-4 sm:px-6 lg:px-8 text-sm">
        {/* Social Icons */}
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

        {/* Dynamic Announcement Carousel */}
        <div className="flex items-center gap-4 sm:gap-6 justify-self-center whitespace-nowrap">
          <button
            aria-label="Previous Announcement"
            className="hover:opacity-75 transition-opacity disabled:opacity-50"
            onClick={handlePrevious}
            disabled={announcements.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <span className="font-semibold tracking-wider text-center text-xs sm:text-sm">
            {announcements[currentIndex].text}
          </span>

          <button
            aria-label="Next Announcement"
            className="hover:opacity-75 transition-opacity disabled:opacity-50"
            onClick={handleNext}
            disabled={announcements.length <= 1}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Spacer for layout */}
        <div className="hidden lg:block justify-self-end"></div>
      </div>
    </div>
  );
};
