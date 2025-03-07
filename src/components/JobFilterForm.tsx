
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { JobFilters } from '@/types/filter';

interface JobFilterFormProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onReset: () => void;
}

const JobFilterForm: React.FC<JobFilterFormProps> = ({ filters, onFilterChange, onReset }) => {
  const handleTypeChange = (value: string) => {
    onFilterChange({ ...filters, type: value });
  };

  const handleSpecChange = (value: string) => {
    onFilterChange({ ...filters, specialization: value });
  };

  const handleExperienceChange = (value: string) => {
    onFilterChange({ ...filters, experience_level: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleUrgentChange = (checked: boolean) => {
    onFilterChange({ ...filters, isUrgent: checked });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Filter Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-type">Job Type</Label>
            <Select 
              value={filters.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="job-type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select 
              value={filters.specialization || "all"}
              onValueChange={handleSpecChange}
            >
              <SelectTrigger id="specialization">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                <SelectItem value="Dermatology">Dermatology</SelectItem>
                <SelectItem value="General Practice">General Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select 
              value={filters.experience_level || "all"}
              onValueChange={handleExperienceChange}
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry-level">Entry-level</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Experienced">Experienced</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="City or region"
              value={filters.location || ''}
              onChange={handleLocationChange}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="urgent-only" 
              checked={filters.isUrgent || false}
              onCheckedChange={handleUrgentChange}
            />
            <Label htmlFor="urgent-only">Urgent positions only</Label>
          </div>

          <Button onClick={onReset} variant="outline" className="w-full mt-4">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilterForm;
