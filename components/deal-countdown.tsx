"use client";

import { useEffect, useState } from "react";

// The core logic to calculate the time remains the same. It's perfect.
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

// --- NEW: A small, focused component for each time unit (Days, Hours, etc.) ---
const TimeBlock = ({ value, label }: { value: number; label: string }) => {
  // We use padStart to ensure the number is always two digits (e.g., 07, 12)
  const formattedValue = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <span className="text-6xl md:text-7xl font-black text-yellow-400">
        {formattedValue}
      </span>
      <span className="mt-1 text-sm font-semibold uppercase tracking-widest text-white/80">
        {label}
      </span>
    </div>
  );
};

// --- The main component, now redesigned ---
const DealCountdown = ({ dealEndDate }: { dealEndDate?: Date | null }) => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  // The useEffect hook for the timer logic remains unchanged.
  useEffect(() => {
    if (!dealEndDate) return;
    const target = new Date(dealEndDate);
    setTime(calculateTimeRemaining(target));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(target);
      setTime(newTime);
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [dealEndDate]);

  // If there's no date or the timer hasn't started, render nothing.
  if (!dealEndDate || !time) {
    return null;
  }

  // --- START: The new visual implementation ---
  return (
    <div className="bg-gray-900 text-white p-6 md:p-8 rounded-2xl flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
        Hurry Up!
      </h2>
      <p className="text-lg text-gray-300">Sales ends in:</p>

      {/* The container for the countdown numbers and separators */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mt-2">
        <TimeBlock value={time.days} label="Days" />
        <span className="text-5xl font-bold text-yellow-400 pb-8">:</span>
        <TimeBlock value={time.hours} label="Hours" />
        <span className="text-5xl font-bold text-yellow-400 pb-8">:</span>
        <TimeBlock value={time.minutes} label="Minutes" />
        <span className="text-5xl font-bold text-yellow-400 pb-8">:</span>
        <TimeBlock value={time.seconds} label="Seconds" />
      </div>
    </div>
  );
  // --- END: The new visual implementation ---
};

export default DealCountdown;
