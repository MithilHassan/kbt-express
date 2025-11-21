import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";

const Contact = () => {
  return (
    <section className="my-20 container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-left">
        <p className="text-orange-500 font-medium text-sm sm:text-base">
          CONTACT WITH US
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          WE WANT TO{" "}
          <span className="text-[#0253A3]">HEAR FROM YOU</span>
        </h2>
      </div>

      {/* Office Info */}
      <div className="max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-5 sm:p-6" data-aos="fade-up">
            <h3 className="font-bold text-xl mb-3">Registered Office</h3>
            <div className="space-y-4 text-gray-700 text-base">
              <p className="flex items-start gap-3">
                <FaPhone className="mt-1" /> +880 1792-111261
              </p>
              <p className="flex items-start gap-3 break-all">
                <FaEnvelope className="mt-1" /> info@kbtexpress.net
              </p>
              <p className="flex items-start gap-3">
                <FaLocationDot className="mt-1" /> 
                <span>
                  Plot # 34, HM Plaza, Floor # 7, Room# 703, Sector # 03, Uttara,
                  Dhaka-1230, Bangladesh
                </span>
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6" data-aos="fade-up">
            <h3 className="font-bold text-xl mb-3">Corporate Office</h3>
            <div className="space-y-4 text-gray-700 text-base">
              <p className="flex items-start gap-3">
                <FaPhone className="mt-1" /> +880 1792-111261
              </p>
              <p className="flex items-start gap-3 break-all">
                <FaEnvelope className="mt-1" /> info@kbtexpress.net
              </p>
              <p className="flex items-start gap-3">
                <FaLocationDot className="mt-1" /> 
                <span>
                  House # 04, Floor # 7, Road # 11, Sector #01, Uttara,
                  Dhaka-1230, Bangladesh
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Contact Form */}
      <form className="max-w-5xl" data-aos="fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="border-slate-300"
              id="name"
              placeholder="Enter your name"
              type="text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="border-slate-300"
              id="email"
              placeholder="Enter your email"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              className="border-slate-300"
              id="mobile_number"
              placeholder="Enter your mobile number"
              type="text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              className="border-slate-300"
              id="subject"
              placeholder="Subject"
              type="text"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              className="border-slate-300"
              placeholder="Message"
              id="message"
              rows={6}
            />
          </div>
        </div>

        {/* Responsive Button */}
        <button
          className="bg-orange-400 hover:bg-orange-500 w-full sm:w-40 text-white py-3 font-semibold rounded-md mt-4 uppercase text-base"
          type="submit"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
