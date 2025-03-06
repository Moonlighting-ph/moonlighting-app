
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 md:px-12',
        isScrolled 
          ? 'glass-effect border-b border-gray-200/30 shadow-sm backdrop-blur-lg' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="#" 
          className="text-xl font-medium tracking-tight transition-opacity duration-300 hover:opacity-70"
        >
          Minimalist
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <a 
            href="#features" 
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            Features
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            Philosophy
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col space-y-1.5 p-2"
          aria-label="Toggle Menu"
        >
          <span className={cn(
            "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
            isMobileMenuOpen && "rotate-45 translate-y-2"
          )} />
          <span className={cn(
            "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
            isMobileMenuOpen && "opacity-0"
          )} />
          <span className={cn(
            "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
            isMobileMenuOpen && "-rotate-45 -translate-y-2"
          )} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg transition-all duration-300 ease-in-out overflow-hidden md:hidden",
        isMobileMenuOpen ? "max-h-56 border-b border-gray-200/30" : "max-h-0"
      )}>
        <div className="flex flex-col space-y-4 px-6 py-6">
          <a 
            href="#features" 
            className="text-sm font-medium py-2 opacity-80 hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium py-2 opacity-80 hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Philosophy
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium py-2 opacity-80 hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
