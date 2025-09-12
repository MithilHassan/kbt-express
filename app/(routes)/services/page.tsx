import Image from "next/image"
import services_1 from "../../../public/services_1.png"
import services_2 from "../../../public/services_2.png"
import services_3 from "../../../public/services_3.png"
import services_4 from "../../../public/services_4.png"
import services_5 from "../../../public/services_5.png"
import services_6 from "../../../public/services_6.png"
import services_7 from "../../../public/services_7.png"
import services_8 from "../../../public/services_8.png"

export default function About() {
  return (
    <section className='container min-h-screen mx-auto my-20'>
      <h2 className="text-3xl font-bold mb-5">SERVICES <span className="text-[#0253A3]">OVERVIEW</span></h2>
        <div className="grid grid-cols-4 gap-5 mt-5">

          <div className="p-5 hover:shadow transition-shadow rounded">
            <Image className="h-40 w-auto" src={services_1} alt="img" />
            <h3 className="text-xl font-bold mb-2">International Express Courier</h3>
            <p className="text-justify">When time is of the essence, KBT will act as your personal courier by collecting the consignment, completing security and customs requirements, posting the necessary bonds, paying any duties and finally handing over the package. All you have to do is pick up the phone.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_2} alt="img" />
            <h3 className="text-xl font-bold mb-2">24 Hour customer support</h3>
            <p className="text-justify">If you have any question regarding our services_ or a shipment, a customer service representative can be reached 24 hours a day, 7 days aweek. Simply call us at +88-01842-007653 or mail us at info@kbtexpress.net</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_3} alt="img" />
            <h3 className="text-xl font-bold mb-2">On time Pick-up & Delivery</h3>
            <p className="text-justify">We offer a wide variety of customs on time pickup and delivery options to meet any budget. You may also choose to drop off items at oneof our nation wide office locations.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_4} alt="img" />
            <h3 className="text-xl font-bold mb-2">Door to Door Delivery</h3>
            <p className="text-justify">Our door to door delivery services_ in the whole world serves all our clients to ensure that their shipments are delivered to their business office hour.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_5} alt="img" />
            <h3 className="text-xl font-bold mb-2">Warehousing & Distribution</h3>
            <p className="text-justify">KBT provides tailored warehousing and distribution solutions, ensuring the right capacity, at the right location, exactly when you need it. With secure storage, smart inventory management, and reliable delivery, we optimize your supply chain and ensure your products are always safe and on time.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_6} alt="img" />
            <h3 className="text-xl font-bold mb-2">Instant Customer Query’s Response</h3>
            <p className="text-justify">We respond instantly to all customer queries. Our representatives are available 24/7 to assist you. Simply call us at +88-01842-007653 or email us at info@kbtexpress.net for immediate support.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_7} alt="img" />
            <h3 className="text-xl font-bold mb-2">Project logistic</h3>
            <p className="text-justify">Our Project Logistics team brings a wealth of local expertise and practical know-how. Working hand in hand with our people on the ground, we design, build, and manage your special projects from the very first concept through to final delivery. No matter the size, weight, or complexity, we ensure every stage is handled seamlessly and efficiently.</p>
          </div>

          <div className="p-5 ">
            <Image className="h-40 w-auto" src={services_8} alt="img" />
            <h3 className="text-xl font-bold mb-2">Worldwide Air & Sea Freight</h3>
            <p className="text-justify">When your cargo needs to be moved quickly, KBT air freight services_ will ensure the shortest transit time. Our team of logistics specialists not only have the experience in managing time-sensitive shipments but also have the contacts, associates and vendor networks to deliver a shipment to remote and challenging destinations.</p>
          </div>

    </div>
    </section>
  );
}
