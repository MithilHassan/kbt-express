import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaLocationDot, FaPhone, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const Contact = () => {
  return (

      <section className="grid my-20 container mx-auto space-y-10">
        <div>
          <p className="text-orange-500 font-medium">CONTACT WITH US</p>
          <h2 className="text-3xl font-bold">
            WE WANT TO <span className="text-[#0253A3]">HEAR FROM YOU</span>
          </h2>
        </div>
        <div className="max-w-4xl">
          <div className="flex gap-5">
              <Card className="px-5" data-aos="fade-up">
                <h3 className="font-bold text-xl mb-2">Registered office</h3>
                <div className="space-y-5 text-gray-700 mt-5 text-base ">
                  <p className="flex gap-5"><FaPhone /> +880 1792-111261</p>
                  <p className="flex gap-5"><FaEnvelope /> info@kbtexpress.net</p>
                  <p className="flex gap-5"> <FaLocationDot /> Plot # 34, HM Plaza, Floor # 7, Room# 703, Sector # 03, Uttara, Dhaka-1230, Bangladesh</p>
                </div>
              </Card>
              <Card className="px-5" data-aos="fade-up">
                <h3 className="font-bold text-xl mb-2">Corporate office</h3>
                <div className="space-y-5 text-gray-700 text-base mt-5">
                  <p className="flex gap-5"><FaPhone /> +880 1792-111261</p>
                  <p className="flex gap-5"><FaEnvelope /> info@kbtexpress.net</p>
                  <p className="flex gap-5"> <FaLocationDot /> House # 04, Floor # 7, Road # 11, Sector #01, Uttara, Dhaka-1230, Bangladesh</p>
                </div>
              </Card>
          </div>
          {/* <div className="flex mt-5 gap-5 text-4xl justify-center">
            <FaFacebook />
            <FaInstagram />
            <FaWhatsapp />
            <FaXTwitter />
            <FaLinkedin />

          </div> */}
        </div>
        <form className="max-w-4xl" data-aos="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input className="border-slate-300" id="name" placeholder="Enter your name" type="text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input className="border-slate-300" id="email" placeholder="Enter your email"  type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input className="border-slate-300" id="mobile_number" placeholder="Enter your mobile number" type="text" />  
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input className="border-slate-300" placeholder="Subject" id="subject" type="text" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                className="border-slate-300"
                placeholder="Message"
                name="message"
                id="message"
                rows={6}
              />
            </div>
          </div>
          <button
            className="bg-orange-400 hover:bg-orange-500 w-40 text-white py-2 font-semibold rounded-md mt-2 uppercase text-base cursor-pointer"
            type="submit"
          >
            Send Message
          </button>
        </form>
      </section>
  );
};

export default Contact;
