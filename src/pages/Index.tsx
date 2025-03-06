
import React from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import WaitlistForm from '../components/WaitlistForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Temporary landing page content - will be replaced with login/signup */}
        <section className="py-20 px-4 md:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                  Moonlighting.ph
                </h2>
                <p className="text-lg text-gray-700 max-w-xl">
                  The future of healthcare staffing in the Philippines. Join our waitlist to be among the first to experience our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <p className="text-sm text-muted-foreground">
                    Coming soon: Login and signup functionality
                  </p>
                </div>
              </div>
              <div className="animate-fade-up animation-delay-300">
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Join Our Waitlist</CardTitle>
                    <CardDescription>
                      Be the first to know when Moonlighting.ph launches.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WaitlistForm />
                  </CardContent>
                </Card>
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
