// components/ServiceCard.tsx
import Image from "next/image";

type ServiceCardProps = {
  src: string;
  alt: string;
  title: string;
  description: string;
  animation?: string;
};

const ServiceCard = ({ src, alt, title, description, animation = "fade-up" }: ServiceCardProps) => (
  <article
  data-aos={animation}
>
  <div className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden h-full">
    <div className="bg-white p-6 text-left">
      <Image
        src={src}
        alt={alt}
        width={400}
        height={200}
        className="rounded-md"
      />
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 text-justify">{description}</p>
      <a href="/services" className="text-sm mt-3 inline-block underline">Read More</a>
    </div>
  </div>
</article>


);

export default ServiceCard;



export const Services = () => (
  <section id="services" className="py-16 bg-white">
    <div className="container mx-auto">
      <div className="px-6">
        <h2 className="text-3xl font-bold">
          WELCOME TO <span className="text-[#0253A3]">KBT EXPRESS</span>
        </h2>
        <p className="text-orange-400 font-medium mb-5">YOUR TRUSTED LOGISTIC PARTNER</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <ServiceCard
          src="/aircargo.jpg"
          alt="Air Cargo"
          title="AIR CARGO"
          description="KBT Express is one of the largest air freight transportation providers in the world. KBT Express provides a full range of air logistics solutions for shipments around the world. In air logistics we focus to help you save money with solutions that focus on quick transit, constant communication, consolidation, and intermodal opportunities."
          animation="fade-up"
        />
        <ServiceCard
          src="/customs.jpg"
          alt="Customs Brokerage"
          title="CUSTOMS BROKERAGE"
          description="KBT Express offers efficient and knowledgeable customs brokerage services to help safely guide your shipments through the complex import customs clearance process. As a customs broker, we help importers and exporters process declarations shipments through customs and associated border agencies."
          animation="fade-up"
        />
        <ServiceCard
          src="/worldwide.jpg"
          alt="Worldwide Express"
          title="WORLDWIDE EXPRESS"
          description="To meet the urgent needs of the customers KBT Express started it’s international courier services and is now operating worldwide. We have arrangement with all the major service providers to ensure the timely delivery of the shipment to their valued worldwide customers. Call us or email us anytime to put one of our international shipping experts to work for you."
          animation="fade-up"
        />

      </div>
    </div>
  </section>
);
