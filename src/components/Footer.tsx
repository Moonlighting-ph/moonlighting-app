
import React from 'react';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white py-16 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="text-xl font-medium tracking-tight mb-6">Minimalist</div>
            <p className="text-gray-600 mb-6 max-w-xs">
              Beautifully crafted digital experiences that focus on simplicity and function.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Press</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Community</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Status</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Minimalist. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Crafted with care and precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
