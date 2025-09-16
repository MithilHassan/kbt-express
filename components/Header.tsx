"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // 👈 Current route path

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0253A3] text-white text-sm py-2">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 px-4 text-center md:text-left">
          <span>Helpline: +88 01842-007653</span>
          <span>House # 04, Road # 11, Sector # 01 Uttara, Dhaka-1230</span>
          <div className="flex gap-3">
            <FaFacebook className="cursor-pointer" title="Facebook" />
            <FaTwitter className="cursor-pointer" title="Twitter" />
            <FaInstagram className="cursor-pointer" title="Instagram" />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="Company Logo" height={60} priority />
        </Link>

        {/* Desktop Nav */}
        {/* Desktop Nav */}
        <nav className="space-x-6 hidden md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`pb-1 border-b-2 ${
                pathname === href ? "border-[#0253A3] text-[#0253A3]" : "border-transparent hover:border-[#0253A3]"
              } transition-colors`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <HiOutlineMenu />
        </button>
      </div>

      {/* Overlay + Slide-in Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sidebar Menu */}
        <div className="relative bg-white w-64 h-full shadow-lg py-6">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <HiOutlineX />
          </button>

          {/* Nav Links */}
          {/* Mobile Nav */}
          <nav className="flex flex-col gap-6 mt-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`pb-1 px-6 border-b-2 ${
                  pathname === href ? "bg-[#0253A3] text-white" : "border-transparent hover:bg-[#0253A3] hover:text-white"
                } transition-colors`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
