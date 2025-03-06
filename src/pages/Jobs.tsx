
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobBoard from '../components/JobBoard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search term is passed to JobBoard via filters
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Next Medical Opportunity</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through available positions at hospitals, clinics, and healthcare facilities across the Philippines.
            </p>
            
            <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Search for jobs, specializations, or locations..."
                className="pl-10 h-12 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
            </form>
          </div>
          
          <JobBoard />
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
