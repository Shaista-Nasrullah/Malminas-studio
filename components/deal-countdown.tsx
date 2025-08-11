// components/deal-countdown.tsx

"use client";

import { useEffect, useState } from "react";

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

const TimeBlock = ({ value, label }: { value: number; label: string }) => {
  const formattedValue = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-black text-yellow-400">
        {formattedValue}
      </span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/80">
        {label}
      </span>
    </div>
  );
};

// --- We add a new prop: onDealEnd ---
interface DealCountdownProps {
  dealEndDate?: Date | null;
  onDealEnd: () => void; // This is a function that the parent will give us
  variant?: "compact" | "full";
}

const DealCountdown = ({
  dealEndDate,
  onDealEnd,
  variant = "full",
}: DealCountdownProps) => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    if (!dealEndDate) return;
    const target = new Date(dealEndDate);

    // If the deal is already over when the component loads, call onDealEnd immediately.
    if (target.getTime() <= Date.now()) {
      onDealEnd();
      return;
    }

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
        onDealEnd(); // --- When the timer hits zero, call the onDealEnd function ---
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [dealEndDate, onDealEnd]);

  if (!dealEndDate || !time) {
    return null;
  }

  // If the time is up, render nothing.
  const isTimeUp =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;
  if (isTimeUp) {
    return null;
  }

  // Your existing beautiful UI for the countdown
  if (variant === "compact") {
    // A smaller version for the product page
    return (
      <div className="bg-gray-900 text-white p-4 rounded-lg flex flex-col items-center gap-2 w-full">
        <h3 className="font-bold text-lg">Sale Ends In:</h3>
        <div className="flex items-center justify-center gap-1.5 md:gap-2.5">
          <TimeBlock value={time.days} label="Days" />
          <span className="text-3xl font-bold text-yellow-400 pb-6">:</span>
          <TimeBlock value={time.hours} label="Hours" />
          <span className="text-3xl font-bold text-yellow-400 pb-6">:</span>
          <TimeBlock value={time.minutes} label="Mins" />
          <span className="text-3xl font-bold text-yellow-400 pb-6">:</span>
          <TimeBlock value={time.seconds} label="Secs" />
        </div>
      </div>
    );
  }

  // The full version you designed
  return (
    <div className="bg-gray-900 text-white p-6 md:p-8 rounded-2xl flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
        Hurry Up!
      </h2>
      <p className="text-lg text-gray-300">Sales ends in:</p>
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
};

export default DealCountdown;
