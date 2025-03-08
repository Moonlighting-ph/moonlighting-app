
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobBoard from '../components/JobBoard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { JobFilters } from '@/types/filter';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});

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
          </div>
          
          <JobBoard initialFilters={filters} />
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
