import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => (
 <section >
    <div className="relative bg-gray-100">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
        </div>
        <div className="relative z-10 container mx-auto py-40 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0253A3]">
            Fast, Reliable, Global Courier & <br /> <span className="">Logistics Partner</span> 
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Finding your next generation courier partner?
          </p>
          <button className="mt-6 bg-orange-400 text-white px-6 py-3 rounded-md cursor-pointer">
            <Link href="/booking">Book Now</Link>
          </button>
          {/* Track Shipment */}
          
        </div>
    </div>
    <div className="bg-[#0253A3] py-3 flex">
            <div className="container mx-auto flex justify-between items-center">
              <div className="font-bold text-white">
                <p>Quick Connnect</p>
                <span>+88 01842-007653</span>
              </div>
              <div>
                <p className="text-white">Track your shipment</p>
                <input
                type="text"
                placeholder="Enter your tracking no."
                className="bg-white flex-1 px-3 py-1 border-none rounded-l-md focus:outline-none"
              />
              <button className="bg-orange-400 text-white px-5 py-1 rounded-r-md cursor-pointer">
                Track
              </button>
              </div>
            </div>
      </div>
    </section>
);