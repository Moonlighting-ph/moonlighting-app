
import React, { useEffect } from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
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

  const handleJoinWaitlist = () => {
    navigate('/waitlist');
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 my-8 text-center">
          <Button 
            onClick={handleJoinWaitlist}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full animate-pulse"
          >
            Join our Waitlist
          </Button>
        </div>
        <Hero />
        <Features />
        <About />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
