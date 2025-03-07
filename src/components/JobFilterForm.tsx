
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { JobFilters } from '@/types/filter';

interface JobFilterFormProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onReset: () => void;
}

const JobFilterForm: React.FC<JobFilterFormProps> = ({ filters, onFilterChange, onReset }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    onFilterChange({ ...filters, isUrgent: checked });
  };

  const handleExperienceLevelChange = (value: string) => {
    onFilterChange({ ...filters, experience_level: value });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">Filter Jobs</h3>
      
      <div className="space-y-2">
        <div>
          <label htmlFor="searchTerm" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="searchTerm"
            name="searchTerm"
            placeholder="Search by job title or description"
            value={filters.searchTerm || ''}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="text-sm font-medium">
            Job Type
          </label>
          <Select
            value={filters.type || ''}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            name="location"
            placeholder="Filter by location"
            value={filters.location || ''}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="specialization" className="text-sm font-medium">
            Specialization
          </label>
          <Select
            value={filters.specialization || ''}
            onValueChange={(value) => handleSelectChange('specialization', value)}
          >
            <SelectTrigger id="specialization">
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Specializations</SelectItem>
              <SelectItem value="Nursing">Nursing</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Surgery">Surgery</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Laboratory">Laboratory</SelectItem>
              <SelectItem value="Radiology">Radiology</SelectItem>
              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
              <SelectItem value="General Practice">General Practice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="experience_level" className="text-sm font-medium">
            Experience Level
          </label>
          <Select
            value={filters.experience_level || ''}
            onValueChange={handleExperienceLevelChange}
          >
            <SelectTrigger id="experience_level">
              <SelectValue placeholder="Select Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Experience Levels</SelectItem>
              <SelectItem value="Entry-level">Entry-level</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Experienced">Experienced</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isUrgent" 
            checked={filters.isUrgent || false}
            onCheckedChange={handleCheckboxChange}
          />
          <label 
            htmlFor="isUrgent" 
            className="text-sm font-medium cursor-pointer"
          >
            Urgent Positions Only
          </label>
        </div>
        
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="w-full mt-2"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilterForm;
