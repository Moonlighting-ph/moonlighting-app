
import React from 'react';
import AnimatedSection from './AnimatedSection';
import { cn } from '@/lib/utils';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <AnimatedSection animation="fade-up" delay={delay} className="flex flex-col h-full">
      <div className="p-4 rounded-2xl bg-gray-100 w-14 h-14 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </AnimatedSection>
  );
};

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600 mb-6">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Thoughtfully designed with purpose
          </h2>
          <p className="text-lg text-gray-600">
            Every element serves a purpose. Clean, functional, and beautifully crafted.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          <Feature 
            title="Mindful Design"
            description="Every detail is meticulously crafted to serve a purpose, eliminating unnecessary elements for a cleaner experience."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>}
            delay={100}
          />
          
          <Feature 
            title="Intuitive Interaction"
            description="Interactions feel natural and effortless, with responsive elements that provide subtle visual feedback."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"/><path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"/><path d="M12 12v9"/><path d="M8 17h8"/></svg>}
            delay={200}
          />
          
          <Feature 
            title="Visual Harmony"
            description="A carefully chosen palette creates visual coherence, with balanced typography and proportions."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>}
            delay={300}
          />
          
          <Feature 
            title="Effortless Navigation"
            description="Information architecture that makes navigation intuitive, helping users find what they need without friction."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>}
            delay={400}
          />
          
          <Feature 
            title="Thoughtful Animation"
            description="Subtle motion that enhances the experience without distraction, guiding attention and providing context."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v16h16"/><path d="m5 19 6-6"/><path d="m2 6 3-3 3 3"/><path d="m18 16 3 3-3 3"/></svg>}
            delay={500}
          />
          
          <Feature 
            title="Refined Aesthetics"
            description="Clean lines, subtle shadows, and precise proportions create a visual language that feels polished and sophisticated."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
            delay={600}
          />
        </div>
        
        <AnimatedSection className="mt-24 p-8 md:p-12 rounded-3xl bg-gray-50 shadow-sm relative overflow-hidden" delay={700}>
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gray-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gray-100 rounded-full opacity-50"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-medium px-3 py-1 bg-gray-200 rounded-full text-gray-700 mb-6">
                Spotlight Feature
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Seamless Integration
              </h3>
              <p className="text-gray-600 mb-6">
                Our product integrates perfectly with your workflow, adapting to your needs rather than forcing you to adapt to it. We've eliminated unnecessary complexity to focus on what matters most.
              </p>
              <a href="#" className="inline-flex items-center text-sm font-medium hover:opacity-80 transition-opacity">
                Learn more
                <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-3xl bg-white shadow-lg p-6 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Features;
