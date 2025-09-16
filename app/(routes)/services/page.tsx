import Image from "next/image";
import services_1 from "../../../public/services_1.png";
import services_2 from "../../../public/services_2.png";
import services_3 from "../../../public/services_3.png";
import services_4 from "../../../public/services_4.png";
import services_5 from "../../../public/services_5.png";
import services_6 from "../../../public/services_6.png";
import services_7 from "../../../public/services_7.png";
import services_8 from "../../../public/services_8.png";

const services = [
  {
    img: services_1,
    title: "International Express Courier",
    desc: "When time is of the essence, KBT will act as your personal courier...",
  },
  {
    img: services_2,
    title: "24 Hour Customer Support",
    desc: "A customer service rep is available 24/7 at +88-01842-007653...",
  },
  {
    img: services_3,
    title: "On-time Pickup & Delivery",
    desc: "We offer a wide variety of on-time pickup and delivery options...",
  },
  {
    img: services_4,
    title: "Door to Door Delivery",
    desc: "Our door-to-door services ensure timely delivery globally...",
  },
  {
    img: services_5,
    title: "Warehousing & Distribution",
    desc: "KBT provides tailored warehousing and smart inventory management...",
  },
  {
    img: services_6,
    title: "Instant Customer Query Response",
    desc: "Our reps respond instantly via phone or email, 24/7...",
  },
  {
    img: services_7,
    title: "Project Logistics",
    desc: "From concept to delivery, we manage complex logistics projects...",
  },
  {
    img: services_8,
    title: "Worldwide Air & Sea Freight",
    desc: "KBT offers rapid air freight and strategic global partnerships...",
  },
];

export default function About() {
  return (
    <section className="container min-h-screen mx-auto my-10 px-4">
      <p className="text-orange-400 font-medium uppercase">What We Do For You</p>
      <h2 className="text-3xl font-bold mb-10">
        SERVICES <span className="text-[#0253A3]">OVERVIEW</span>
      </h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="w-full"
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <div className="mb-9 rounded-xl py-8 px-7 shadow-md bg-white hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] sm:p-9 lg:px-6 xl:px-9">
              <div className="mx-auto mb-7 inline-block">
                <Image
                  alt={service.title}
                  src={service.img}
                  className="h-40 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl">
                  {service.title}
                </h3>
                <p className="text-base font-medium text-body-color text-gray-700">
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
