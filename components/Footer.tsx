import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import logo from "../public/logo.png"
import Image from "next/image";

export const Footer = () => (
   <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
        <div className="container mx-auto flex justify-between">
          {/* Logo & About */}
          <div className="w-1/2">
            <Image src={logo} alt="Logo" height={60} />
            <p className="mt-4 text-sm text-justify">KBT Express is your trusted courier partner in Bangladesh. With 26+ years of industry experience, we provide international express delivery, door-to-door service, warehousing, and freight solutions.</p>
            <div className="flex gap-3 mt-4">
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Terms & Condition</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">GET IN TOUCH</h4>
            <p>+88-01842-007653</p>
            <p>info@kbtexpress.net</p>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">
          © Copyright kbtexpress.net - All Rights Reserved
        </p>
      </footer>
);