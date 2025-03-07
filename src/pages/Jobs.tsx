
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

  // Updated search handler to match useJobFilters.ts approach
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Apply the search term to filter jobs by title, description, or facility/company
      setFilters(prev => ({ 
        ...prev, 
        searchTerm: searchTerm.trim()
      }));
    } else {
      // If search is empty, remove the searchTerm filter
      const { searchTerm: _, ...restFilters } = filters;
      setFilters(restFilters);
    }
  };

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
    if (filters.searchTerm) {
      const { searchTerm: _, ...restFilters } = filters;
      setFilters(restFilters);
    }
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
                className="pl-10 h-12 bg-white pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button 
                  type="button"
                  className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          
          <JobBoard initialFilters={filters} />
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
