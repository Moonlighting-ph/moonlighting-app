
import React, { useEffect } from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  // Initialize page with smooth scrolling
  useEffect(() => {
    // Optional: Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Optional: Handle hash links on page load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, []);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Features />
        <About />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
