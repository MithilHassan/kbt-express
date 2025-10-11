"use client"

import { HeroSection } from '../../components/HeroSection';
import { Services } from '@/components/ServiceSection';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

export default function Home() {

   useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      once: true,     // animate only once on scroll
    });
  }, []);

  return (
    <div>
      <HeroSection />
      <Services />
    </div>
  );
}
