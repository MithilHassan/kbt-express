import Image from "next/image";

export const Branches = () => (
  <section id="services" className=" py-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">Welcome to <span className="text-blue-900">KBT EXPRESS</span></h2>
          <p className="text-orange-500 font-medium mt-2">YOUR TRUSTED LOGISTIC PARTNER</p>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-lg text-left">
              <Image
                src="/aircargo.jpg"
                alt="Air Cargo"
                width= {400}
                height={200}
                className="rounded-md"
              />
              <div className="px-4">
                <h3 className="mt-4 font-bold text-lg">AIR CARGO</h3>
                <p className="text-sm text-gray-600 mt-2">
                  KBT Express is one of the largest air freight transportation providers in the world...
                </p>
                <a href="#" className="text-blue-600 mt-3 inline-block">Read More</a>
              </div>
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
                KBT Express offers efficient and knowledgeable customs brokerage services...
              </p>
              <a href="#" className="text-blue-600 mt-3 inline-block">Read More</a>
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
                To meet the urgent needs of customers, KBT Express started its international courier services...
              </p>
              <a href="#" className="text-blue-600 mt-3 inline-block">Read More</a>
            </div>
          </div>
        </div>
      </section>
);