
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 px-6 md:px-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
      
      {/* Abstract shapes */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-100 rounded-full filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <AnimatedSection animation="fade-up" delay={300}>
              <span className="inline-block text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600 mb-6">
                Beautifully Crafted
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6">
                Simplicity is the<br />ultimate sophistication
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Introducing a product that embraces simplicity and functionality, designed with meticulous attention to detail.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#features" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  Discover More
                </a>
                <a 
                  href="#about" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-medium transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Learn Our Philosophy
                </a>
              </div>
            </AnimatedSection>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <AnimatedSection animation="scale-in" delay={600}>
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl bg-gray-200 overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full h-full rounded-2xl bg-white shadow-inner flex items-center justify-center p-4">
                      <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-xl bg-gray-100 shadow-lg"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 rounded-lg bg-gray-900 shadow-lg"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
