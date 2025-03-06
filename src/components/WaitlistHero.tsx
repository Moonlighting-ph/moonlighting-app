
import React from 'react';
import { Button } from './ui/button';
import WaitlistForm from './WaitlistForm';

const WaitlistHero = () => {
  return (
    <section id="waitlist" className="py-20 px-4 md:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Sign up for early access
            </h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Join our waitlist to be among the first to experience the future of healthcare staffing. 
              Get exclusive updates and early access to Moonlighting.ph.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <a href="#learn-more">Learn More</a>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up animation-delay-300">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistHero;
