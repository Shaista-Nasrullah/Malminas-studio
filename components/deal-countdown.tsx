"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

// This is a pure utility function to calculate time difference. It remains the same.
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

// A small, reusable component for each stat box in the countdown.
const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

// The main, fully dynamic DealCountdown component.
const DealCountdown = ({
  dealProductSlug,
  dealEndDate,
}: {
  dealProductSlug?: string;
  dealEndDate?: Date | null; // Accepts a Date, null, or undefined.
}) => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    // 1. If no end date is provided from the server, we don't start the timer.
    if (!dealEndDate) {
      return;
    }

    // 2. The target date is now the dynamic prop from the database.
    const target = new Date(dealEndDate);

    // 3. Set the initial time immediately when the component mounts.
    setTime(calculateTimeRemaining(target));

    // 4. Start an interval to update the time every second.
    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(target);
      setTime(newTime);

      // Stop the timer when it reaches zero to save resources.
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    // 5. Cleanup function: This is crucial. It clears the interval if the component is unmounted.
    return () => clearInterval(timerInterval);
  }, [dealEndDate]); // The effect re-runs only if the dealEndDate prop changes.

  // If there is no active deal from the server, or if the timer hasn't initialized, render nothing.
  if (!dealEndDate || !time) {
    return null;
  }

  // Determine the correct link for the button.
  const buttonLink = dealProductSlug
    ? `/product/${dealProductSlug}`
    : "/search";

  // If the countdown has finished, show the "Deal Has Ended" message.
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="wrapper grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check out our latest promotions!
          </p>

          <div className="text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/m6.png"
            alt="promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  // If the countdown is active, display the banner.
  return (
    <section className="wrapper grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Gett ready for a shopping experience like never before with our Deals
          of the Month! Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
          Don&apos;t miss out! 🎁🛒
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href={buttonLink}>View The Deal</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src="/images/m6.png" alt="promotion" width={300} height={200} />
      </div>
    </section>
  );
};

export default DealCountdown;

// "use client";

// import Link from "next/link";
// import { Button } from "./ui/button";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// // Static target date (replace with desired date)
// const TARGET_DATE = new Date("2025-07-20T00:00:00");

// // Function to calculate the time remaining
// const calculateTimeRemaining = (targetDate: Date) => {
//   const currentTime = new Date();
//   const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
//   return {
//     days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
//     hours: Math.floor(
//       (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     ),
//     minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
//     seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
//   };
// };

// const DealCountdown = () => {
//   const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

//   useEffect(() => {
//     // Calculate initial time on client
//     setTime(calculateTimeRemaining(TARGET_DATE));

//     const timerInterval = setInterval(() => {
//       const newTime = calculateTimeRemaining(TARGET_DATE);
//       setTime(newTime);

//       if (
//         newTime.days === 0 &&
//         newTime.hours === 0 &&
//         newTime.minutes === 0 &&
//         newTime.seconds === 0
//       ) {
//         clearInterval(timerInterval);
//       }

//       return () => clearInterval(timerInterval);
//     }, 1000);
//   }, []);

//   if (!time) {
//     return (
//       <section className="grid grid-cols-1 md:grid-cols-2 my-20">
//         <div className="flex flex-col gap-2 justify-center">
//           <h3 className="text-3xl font-bold">Loading Countdown...</h3>
//         </div>
//       </section>
//     );
//   }

//   if (
//     time.days === 0 &&
//     time.hours === 0 &&
//     time.minutes === 0 &&
//     time.seconds === 0
//   ) {
//     return (
//       <section className="wrapper grid grid-cols-1 md:grid-cols-2 my-20">
//         <div className="flex flex-col gap-2 justify-center">
//           <h3 className="text-3xl font-bold">Deal Has Ended</h3>
//           <p>
//             This deal is no longer available. Check out our latest promotions!
//           </p>

//           <div className="text-center">
//             <Button asChild>
//               <Link href="/search">View Products</Link>
//             </Button>
//           </div>
//         </div>
//         <div className="flex justify-center">
//           <Image
//             src="/images/m6.png"
//             alt="promotion"
//             width={300}
//             height={200}
//           />
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="wrapper grid grid-cols-1 md:grid-cols-2 my-20">
//       <div className="flex flex-col gap-2 justify-center">
//         <h3 className="text-3xl font-bold">Deal Of The Month</h3>
//         <p>
//           Gett ready for a shopping experience like never before with our Deals
//           of the Month! Every purchase comes with exclusive perks and offers,
//           making this month a celebration of savvy choices and amazing deals.
//           Don&apos;t miss out! 🎁🛒
//         </p>
//         <ul className="grid grid-cols-4">
//           <StatBox label="Days" value={time.days} />
//           <StatBox label="Hours" value={time.hours} />
//           <StatBox label="Minutes" value={time.minutes} />
//           <StatBox label="Seconds" value={time.seconds} />
//         </ul>
//         <div className="text-center">
//           <Button asChild>
//             <Link href="/search">View Products</Link>
//           </Button>
//         </div>
//       </div>
//       <div className="flex justify-center">
//         <Image src="/images/m6.png" alt="promotion" width={300} height={200} />
//       </div>
//     </section>
//   );
// };

// const StatBox = ({ label, value }: { label: string; value: number }) => (
//   <li className="p-4 w-full text-center">
//     <p className="text-3xl font-bold">{value}</p>
//     <p>{label}</p>
//   </li>
// );

// export default DealCountdown;
