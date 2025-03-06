
import React from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import AuthForm from '../components/auth/AuthForm';

const Index: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <section className="py-20 px-4 md:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                  Moonlighting.ph
                </h2>
                <p className="text-lg text-gray-700 max-w-xl">
                  The future of healthcare staffing in the Philippines. Connect with healthcare providers and professionals seamlessly.
                </p>
              </div>
              <div className="animate-fade-up animation-delay-300">
                <AuthForm />
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        <About />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
