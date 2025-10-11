import Image from "next/image";

export const HeroBackground = () => (
  <div className="absolute inset-0">
    <Image
      src="/hero-bg.jpg"
      alt="Background"
      fill
      className="object-cover w-full h-full opacity-80"
    />
  </div>
);


import Link from "next/link";
import { useState } from "react";

export const HeroContent = () => (
  <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-40 text-left animate-fade-in">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0253A3] leading-snug">
      Fast, Reliable, Global Courier & <br />
      <span>Logistics Partner</span>
    </h1>
    <p className="mt-4 text-base sm:text-lg text-gray-700">
      Finding your next generation courier partner?
    </p>

    <Link
      href="/booking"
      className="mt-6 inline-block bg-orange-400 text-white px-6 py-3 rounded-md cursor-pointer text-sm sm:text-base"
    >
      Book Now
    </Link>
  </div>
);

export function TrackShipmentBar() {
  const [bookingId, setBookingId] = useState("");

  return ( // ✅ You need to return the JSX here
    <div className="bg-[#0253A3] py-6">
      <div className="container mx-auto flex flex-row justify-between items-center px-4 gap-6 sm:gap-0">
        <div className="text-center sm:text-left hidden sm:block">
          <p className="text-white font-semibold text-lg">Quick Connect</p>
          <span className="text-white text-sm block sm:inline-block">
            +880 1792-111261
          </span>
        </div>

        <div className="w-full sm:w-auto text-left">
          <p className="text-white font-semibold text-lg mb-2">Track your shipment</p>
          <div className="flex flex-row items-center">
            <input
              type="text"
              placeholder="Enter your tracking no."
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)} // ✅ updates state
              className="bg-white px-4 py-2 rounded-l-md rounded-r-none focus:outline-none text-sm w-full sm:w-64"
            />
            <Link
              className="bg-orange-400 text-white px-5 py-2 rounded-r-md rounded-l-none ww-auto text-sm cursor-pointer"
              href={`/${bookingId}`}
            >
              Track
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

  





export const HeroSection = () => (
  <section>
    <div className="relative bg-gray-100">
      <HeroBackground />
      <HeroContent />
    </div>
    <TrackShipmentBar />
  </section>
);
