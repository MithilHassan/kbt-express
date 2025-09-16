import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <>
      {/* Contact Info Cards */}
      <section className="bg-slate-100">
        <div className="container mx-auto pt-10 pb-20 px-4">
          <h2 className="text-3xl font-bold mb-5">
            GET <span className="text-[#0253A3]">IN TOUCH</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[
              {
                title: "Registered Office",
                address: "Plot # 34, HM Plaza, Floor # 7, Room# 703, Sector # 03, Uttara, Dhaka-1230, Bangladesh",
              },
              {
                title: "Corporate Office",
                address: "House # 04, Floor # 7, Road # 11, Sector #01, Uttara, Dhaka-1230, Bangladesh",
              },
              {
                title: "Chittagong Office",
                address: "Sabbir Chamber (3rd Floor), 60, Agrabad C/A, Chittagong, Bangladesh",
              },
              {
                title: "Khulna Office",
                address: "House # 98, Ward # 9, City Bypass Road, KMP, Khulna, Bangladesh",
              },
              {
                title: "Rajshahi (Rooppur) Office",
                address: "Diar Baghoil, Post: Diar Shahapur-6620, Ishwardi, Pabna, Bangladesh",
              },
            ].map((office, index) => (
              <Card key={index} className="p-5 shadow-md" data-aos="fade-up" data-aos-delay={index * 100}>
                <h3 className="font-bold text-xl mb-2">{office.title}</h3>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>📞 +88-01842-007653</p>
                  <p>✉️ info@kbtexpress.net</p>
                  <p>📍 {office.address}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="my-20">
        <form className="container mx-auto px-4 max-w-5xl" data-aos="fade-up">
          <p className="text-orange-500 font-medium">CONTACT WITH US</p>
          <h2 className="text-3xl font-bold mb-5">
            WE WANT TO <span className="text-[#0253A3]">HEAR FROM YOU</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
            <Input className="border-slate-300" placeholder="Name" type="text" />
            <Input className="border-slate-300" placeholder="Email" type="email" />
            <Input className="border-slate-300" placeholder="Mobile Number" type="text" />
            <Input className="border-slate-300" placeholder="Subject" type="text" />
            <Input className="border-slate-300" placeholder="Pick Up Post Code" type="text" />
            <Input className="border-slate-300" placeholder="Delivery Location" type="text" />
            <Textarea
              className="border-slate-300 sm:col-span-2"
              placeholder="Message"
              name="message"
              id="message"
              rows={6}
            />
          </div>
          <button
            className="bg-orange-400 hover:bg-orange-500 w-40 text-white py-2 font-semibold rounded-md mt-2 uppercase text-base cursor-pointer"
            type="submit"
          >
            Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default Contact;
