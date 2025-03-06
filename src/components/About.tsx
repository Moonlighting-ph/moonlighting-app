
import React from 'react';
import AnimatedSection from './AnimatedSection';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-medium px-3 py-1 bg-white rounded-full text-gray-600 mb-6">
            Our Philosophy
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Less, but better
          </h2>
          <p className="text-lg text-gray-600">
            We believe in the power of thoughtful restraint, where every element serves a purpose.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-16">
          <AnimatedSection animation="fade-right">
            <div className="relative">
              <div className="rounded-3xl bg-white shadow-lg p-8 relative z-10">
                <blockquote className="italic text-xl md:text-2xl font-light text-gray-600 mb-6">
                  "Design is not just what it looks like and feels like. Design is how it works."
                </blockquote>
                <div>
                  <p className="font-medium">Design Philosophy</p>
                  <p className="text-sm text-gray-500">Simplicity & Function</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-200 rounded-3xl -z-10"></div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-left" delay={300}>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Form Follows Function</h3>
                <p className="text-gray-600">We believe that beautiful design emerges from solving real problems, not from decoration. Every element in our product has been considered for its purpose and necessity.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Thoughtful Minimalism</h3>
                <p className="text-gray-600">Our approach focuses on removing the unnecessary so that the necessary can speak. We create breathing room for what matters most.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Human-Centered Design</h3>
                <p className="text-gray-600">We design for people first, creating intuitive experiences that respect the user's intelligence and time. Technology should adapt to humans, not the other way around.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="rounded-2xl bg-white p-6 h-full shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Clarity</h3>
              <p className="text-gray-600 text-sm">
                Eliminate ambiguity. Design should be clear in its purpose and function, avoiding unnecessary complexity.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="rounded-2xl bg-white p-6 h-full shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 11 2-2-2-2"/>
                  <path d="M11 13h4"/>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Consistency</h3>
              <p className="text-gray-600 text-sm">
                Create familiar patterns. Users shouldn't have to wonder whether different words, situations, or actions mean the same thing.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="rounded-2xl bg-white p-6 h-full shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Delight</h3>
              <p className="text-gray-600 text-sm">
                Create moments of joy. While maintaining simplicity, find opportunities to surprise and delight users with thoughtful interactions.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
