
import React from 'react';
import type { JobFilters as JobFiltersType } from '@/hooks/useJobFilters';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';

// Sample specializations - in a real app, these would come from an API or database
const SPECIALIZATIONS = [
  { value: 'nurse', label: 'Nurse' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'medical_technologist', label: 'Medical Technologist' },
  { value: 'physical_therapist', label: 'Physical Therapist' },
  { value: 'radiologic_technologist', label: 'Radiologic Technologist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'midwife', label: 'Midwife' },
  { value: 'occupational_therapist', label: 'Occupational Therapist' },
  { value: 'dentist', label: 'Dentist' },
];

interface JobFiltersProps {
  filters: JobFiltersType;
  onUpdateFilter: <K extends keyof JobFiltersType>(key: K, value: JobFiltersType[K]) => void;
  onResetFilters: () => void;
  totalJobs: number;
  filteredCount: number;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  totalJobs,
  filteredCount,
}) => {
  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString()}`;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search keyword */}
          <div className="md:col-span-6 lg:col-span-4">
            <Label htmlFor="keyword" className="mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="keyword"
                placeholder="Search job title, facility..."
                className="pl-8"
                value={filters.keyword}
                onChange={(e) => onUpdateFilter('keyword', e.target.value)}
              />
              {filters.keyword && (
                <button 
                  className="absolute right-2 top-2.5" 
                  onClick={() => onUpdateFilter('keyword', '')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-6 lg:col-span-3">
            <Label htmlFor="location" className="mb-2 block">Location</Label>
            <Input
              id="location"
              placeholder="City or region"
              value={filters.location}
              onChange={(e) => onUpdateFilter('location', e.target.value)}
            />
          </div>

          {/* Specialization */}
          <div className="md:col-span-6 lg:col-span-3">
            <Label htmlFor="specialization" className="mb-2 block">Specialization</Label>
            <Select
              value={filters.specialization}
              onValueChange={(value) => onUpdateFilter('specialization', value)}
            >
              <SelectTrigger id="specialization">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specializations</SelectItem>
                {SPECIALIZATIONS.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pay Range */}
          <div className="md:col-span-12 lg:col-span-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Pay Range (per hour)</Label>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(filters.payRange[0])} - {formatCurrency(filters.payRange[1])}
              </span>
            </div>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={filters.payRange}
              onValueChange={(value) => onUpdateFilter('payRange', value as [number, number])}
              className="py-2"
            />
          </div>

          {/* Date Range */}
          <div className="md:col-span-6 lg:col-span-3">
            <Label className="mb-2 block">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange[0] && filters.dateRange[1] ? (
                    <>
                      {format(filters.dateRange[0], 'LLL dd, y')} - {format(filters.dateRange[1], 'LLL dd, y')}
                    </>
                  ) : filters.dateRange[0] ? (
                    <>From {format(filters.dateRange[0], 'LLL dd, y')}</>
                  ) : filters.dateRange[1] ? (
                    <>Until {format(filters.dateRange[1], 'LLL dd, y')}</>
                  ) : (
                    <span className="text-muted-foreground">Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  defaultMonth={filters.dateRange[0] || undefined}
                  selected={{
                    from: filters.dateRange[0] || undefined,
                    to: filters.dateRange[1] || undefined,
                  }}
                  onSelect={(range) => {
                    onUpdateFilter('dateRange', [
                      range?.from || null,
                      range?.to || null,
                    ]);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Urgent Only */}
          <div className="md:col-span-6 lg:col-span-3 flex items-end">
            <div className="flex items-center space-x-2 w-full">
              <Switch
                id="urgentOnly"
                checked={filters.urgentOnly}
                onCheckedChange={(checked) => onUpdateFilter('urgentOnly', checked)}
              />
              <Label htmlFor="urgentOnly">Urgent Shifts Only</Label>
            </div>
          </div>

          {/* Reset button and results counter */}
          <div className="md:col-span-12 flex flex-col md:flex-row items-center justify-between mt-2">
            <Button 
              variant="outline" 
              onClick={onResetFilters}
              className="w-full md:w-auto mb-2 md:mb-0"
            >
              Reset Filters
            </Button>
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalJobs}</span> jobs
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
