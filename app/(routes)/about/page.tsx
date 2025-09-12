import Image from "next/image"
import gallery from "../../../public/services.png"



const About = () => (
  <section className="min-h-screen">
    <div className="container mx-auto py-14">
      <p className="text-orange-400 font-medium">WE STARTED WITH A SIMPLE IDEA</p>
      <h2 className="text-3xl font-bold mb-5">COMPANY <span className="text-[#0253A3]">OVERVIEW</span></h2>
      <div className="grid grid-cols-2 gap-10">
        <p className="text-xl">
        KBT Express started its journey having more than 20 years of experienced employees, expertise and infrastructure. <br /><br />
        KBT Express is an International express delivery partner in Bangladesh that offers door-to-door delivery. Our aim and vision are to provide the best delivery services to all of our clients through our principles / strate-gic partners all over the world. We have more than 55 full-time employees and cover delivery business network by
        Domestic courier and its own fleet of operation 13 vehicles, 3 cars, 12 motorbikes, 4 branch offices in 4 division in Bangladesh. <br /><br />
        On a monthly basis, KBT Express has the capacity to handle more than 100 tons in volume and 25000 thousand in consignments of export and import. We believe in innovation, cost-effectiveness, reliability, and providing quality service at all times.  <br /><br />
        KBT Express is working with a vision to establish its name as a first-class courier service company in Bangladesh with the help of our strong well versed operational
        team. We offer quick, efficient, and reliable courier solutions for fast and efficient
        delivery on time.
        </p>
        <Image src={gallery} alt="KBT Express" className="w-full h-full object-cover" />
      </div>  
    </div>
  </section>
);

export default About;
