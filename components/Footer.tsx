'use client';

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import Image from "next/image";
import logo from "../public/logo.png";

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#0253A3] text-white shadow-lg hover:bg-[#013364] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTopButton;

export const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
    <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10">
      {/* Logo & About */}
      <div>
        <Image src={logo} alt="KBT Express Logo" height={60} />
        <p className="mt-4 text-sm text-justify">
          KBT Express is your trusted courier partner in Bangladesh. With 26+ years of industry experience, we provide international express delivery, door-to-door service, warehousing, and freight solutions.
        </p>
        <div className="flex gap-4 mt-4 text-xl">
          <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white transition">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white transition">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white transition">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Navigation Links */}
      <nav>
        <h4 className="font-bold text-lg mb-4">COMPANY</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition">Home</a></li>
          <li><a href="#" className="hover:text-white transition">About Us</a></li>
          <li><a href="#" className="hover:text-white transition">Services</a></li>
          <li><a href="#" className="hover:text-white transition">Terms & Condition</a></li>
          <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
        </ul>
      </nav>

      {/* Contact Info */}
      <address className="not-italic text-sm">
        <h4 className="font-bold text-lg mb-4">GET IN TOUCH</h4>
        <p className="mb-2">Phone: <a href="tel:+8801842007653" className="hover:text-white transition">+88-01842-007653</a></p>
        <p>Email: <a href="mailto:info@kbtexpress.net" className="hover:text-white transition">info@kbtexpress.net</a></p>
      </address>
    </div>

    <p className="text-center text-gray-500 text-sm mt-10">
      © {new Date().getFullYear()} kbtexpress.net — All Rights Reserved
    </p>
    <ScrollToTopButton />
  </footer>
);
