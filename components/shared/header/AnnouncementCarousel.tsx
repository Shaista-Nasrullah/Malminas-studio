// In components/shared/header/AnnouncementCarousel.tsx
"use client";

import { useEffect, useState, type FC } from "react";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok, FaPinterest } from "react-icons/fa";
import { type Announcement } from "@prisma/client";
import { PRIMARY_COLOR } from "@/lib/constants";

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

export const AnnouncementCarousel: FC<AnnouncementCarouselProps> = ({
  announcements,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const socialLinks = [
    {
      label: "Facebook",
      icon: FaFacebook,
      href: "https://www.facebook.com/share/1CTnhSUGjU/?mibextid=wwXIfr",
    },
    {
      label: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/malminas_traditional_wear?utm_source=qr",
    },
    {
      label: "Tiktok",
      icon: FaTiktok,
      href: "https://www.tiktok.com/@malmina910?_t=ZS-8zDcOxA8Vlq&_r=1",
    },
    {
      label: "Pinterest",
      icon: FaPinterest,
      href: "https://pin.it/6CkqZpKfX",
    },
  ];

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

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
    <div
      style={{ backgroundColor: PRIMARY_COLOR }}
      className="text-white w-full h-10 flex items-center"
    >
      {/* --- THIS IS THE FINAL FIX --- */}
      {/* Updated grid classes for full responsiveness */}
      <div className="wrapper mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center py-2 px-4 sm:px-6 lg:px-8 text-sm">
        {/* Social Icons: Now visible on medium screens and up */}
        <div className="hidden md:flex items-center gap-5 justify-self-start">
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

        {/* Dynamic Announcement Carousel: Adjusts alignment for medium screens */}
        <div className="flex items-center gap-4 sm:gap-6 justify-self-center md:justify-self-end lg:justify-self-center whitespace-nowrap">
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

        {/* Spacer for large screen layout (unchanged) */}
        <div className="hidden lg:block justify-self-end"></div>
      </div>
    </div>
  );
};
