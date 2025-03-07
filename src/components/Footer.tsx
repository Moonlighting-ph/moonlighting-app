
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Moon } from './icons/Moon';

const FooterSection = () => {
  return (
    <footer className="bg-background py-12 md:py-16 border-t">
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="relative p-1">
                <div className="absolute inset-0 rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <Moon className="h-8 w-8 text-primary relative z-10" />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl">moonlighting.ph</span>
            </Link>
            <p className="text-muted-foreground">
              Seamlessly connects understaffed hospitals with pre-vetted, on-demand medical professionals
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="text-muted-foreground">
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <p className="text-muted-foreground">
              Email: <a href="mailto:hello@moonlighting.ph" className="hover:text-primary transition-colors">hello@moonlighting.ph</a>
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Moonlighting.ph. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
