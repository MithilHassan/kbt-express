import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="bg-[#0253A3] text-white text-sm py-2">
        <div className=" container mx-auto flex justify-between items-center">
        <span>Helpline: +88 01842-007653</span>
        <span>House # 04, Road # 11, Sector # 01 Uttara, Dhaka-1230</span>
        <div className="flex gap-3">
          <FaFacebook className="cursor-pointer" />
          <FaTwitter className="cursor-pointer" />
          <FaInstagram className="cursor-pointer" />
        </div>
      </div>
    </div>
      <div className="container mx-auto flex justify-between items-center py-3">
              <Link href="/">
        <Image src={logo} alt="Contact map" height={60} />
      </Link>
        <nav className="space-x-6 hidden md:flex">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
    </header>
  );
}
