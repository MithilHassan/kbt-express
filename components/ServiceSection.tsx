import Image from "next/image";
import services from "../public/services.png"


export const Services = () => (
  <section id="services" className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">WELCOME TO <span className="text-[#0253A3]">KBT EXPRESS</span></h2>
          <p className="text-orange-400 font-medium mb-5">YOUR TRUSTED LOGISTIC PARTNER</p>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-left">
              <Image
                src="/aircargo.jpg"
                alt="Air Cargo"
                width={400}
                height={200}
                className="rounded-md"
              />
              <h3 className="mt-4 font-bold text-lg">AIR CARGO</h3>
              <p className="text-sm text-gray-600 mt-2">
                KBT Express is one of the largest air freight transportation providers in the world. KBT Express provides a full range of air logistics solutions for shipments around the world. In air logistics we focus to help you save money with solutions that focus on quick transit, constant communication, consolidation, and intermodal opportunities.
              </p>
              <a href="/services" className="text-sm mt-3 inline-block underline">Read More</a>
            </div>
            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-left">
              <Image
                src="/customs.jpg"
                alt="Customs Brokerage"
                width={400}
                height={200}
                className="rounded-md"
              />
              <h3 className="mt-4 font-bold text-lg">CUSTOMS BROKERAGE</h3>
              <p className="text-sm text-gray-600 mt-2">
                KBT Express offers efficient and knowledgeable customs brokerage services to help safely guide your shipments through the complex import customs clearance process. As a customs broker, we help importers and exporters process declarations shipments through customs and associated border agencies.
              </p>
              <a href="/services" className="text-sm mt-3 inline-block underline">Read More</a>
            </div>
            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-left">
              <Image
                src="/worldwide.jpg"
                alt="Worldwide Express"
                width={400}
                height={200}
                className="rounded-md"
              />
              <h3 className="mt-4 font-bold text-lg">WORLDWIDE EXPRESS</h3>
              <p className="text-sm text-gray-600 mt-2">
                To meet the urgent needs of the customers KBT Express started it’s international courier services and is now operating worldwide. We have arrangement with all the major service providers to ensure the timely delivery of the shipment to their valued worldwide customers. Call us or email us anytime to put one of our international shipping experts to work for you.
              </p>
              <a href="/services" className="text-sm mt-3 inline-block underline">Read More</a>
            </div>
          </div>
        </div>
      </section>
);