
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { JobFilters } from '@/types/filter';

interface JobFilterFormProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onReset: () => void;
}

const JobFilterForm: React.FC<JobFilterFormProps> = ({ 
  filters, 
  onFilterChange, 
  onReset 
}) => {
  const [formValues, setFormValues] = useState<JobFilters>(filters);

  // Update form values when filters prop changes
  useEffect(() => {
    setFormValues(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormValues(prev => ({ ...prev, isUrgent: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(formValues);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filter Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="searchTerm">Search</Label>
            <Input 
              id="searchTerm"
              name="searchTerm"
              placeholder="Job title, company, keywords..."
              value={formValues.searchTerm || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Select 
              value={formValues.type || ""}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="All job types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All job types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              name="location"
              placeholder="City, province..."
              value={formValues.location || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Select 
              value={formValues.specialization || ""}
              onValueChange={(value) => handleSelectChange('specialization', value)}
            >
              <SelectTrigger id="specialization">
                <SelectValue placeholder="All specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All specializations</SelectItem>
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
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select 
              value={formValues.experience_level || ""}
              onValueChange={(value) => handleSelectChange('experience_level', value)}
            >
              <SelectTrigger id="experience_level">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="Entry-level">Entry-level</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Experienced">Experienced</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="urgent"
              checked={formValues.isUrgent || false}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="urgent">Urgent Positions Only</Label>
          </div>
          
          <div className="pt-2 space-y-2">
            <Button type="submit" className="w-full">Apply Filters</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobFilterForm;
