import Image from "next/image";
import gallery from "../../../public/services.png";

const About = () => (
  <section className="min-h-screen bg-white">
    <div className="container mx-auto py-14 px-4">
      <p className="text-orange-400 font-medium uppercase">We started with a simple idea</p>
      <h2 className="text-3xl font-bold mb-8">
        COMPANY <span className="text-[#0253A3]">OVERVIEW</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <div className="space-y-6 text-lg text-justify leading-relaxed">
          <p>
            KBT Express started its journey having more than 26 years of experienced employees, expertise, and infrastructure.
          </p>
          <p>
            KBT Express is an international express delivery partner in Bangladesh offering door-to-door services. Our aim is to provide the best delivery services to all our clients through strategic global partners.
          </p>
          <p>
            We have over 55 full-time employees and a delivery network supported by domestic couriers, 13 operational vehicles, 3 cars, 12 motorbikes, and 4 branch offices across major divisions in Bangladesh.
          </p>
          <p>
            Every month, KBT Express handles over 100 tons of shipments and 25,000 consignments (export and import).
            We believe in innovation, cost-effectiveness, reliability, and consistent quality service.
          </p>
          <p>
            Our vision is to establish KBT Express as a first-class courier service company in Bangladesh, backed by a strong operational team delivering fast, efficient, and reliable services.
          </p>
        </div>

        {/* Image */}
        <div className="w-full h-full">
          <Image
            src={gallery}
            alt="KBT Express"
            className="w-full object-cover rounded-lg shadow-md"
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default About;
