
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
              <li className="mb-2"><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li className="mb-2"><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li className="mb-2"><a href="#jobs" className="hover:text-primary transition-colors">Job Listings</a></li>
              <li><Link to="/client" className="hover:text-primary transition-colors">For Medical Providers</Link></li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <p className="text-muted-foreground">
              Email: <a href="mailto:info@moonlighting.ph" className="hover:text-primary transition-colors">info@moonlighting.ph</a>
            </p>
            <p className="text-muted-foreground">
              Phone: <a href="tel:+639123456789" className="hover:text-primary transition-colors">+63 912 345 6789</a>
            </p>
            <p className="text-muted-foreground">
              Address: 123 Main Street, Metro Manila, Philippines
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
