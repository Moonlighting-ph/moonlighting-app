
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface JobFiltersProps {
  isMobile: boolean;
  savedOnly: boolean;
  setSavedOnly: (value: boolean) => void;
  urgentOnly: boolean;
  setUrgentOnly: (value: boolean) => void;
  salaryRange: [number, number];
  setSalaryRange: (value: [number, number]) => void;
  jobType: string[];
  handleJobTypeChange: (type: string) => void;
  selectedLocations: string[];
  handleLocationChange: (location: string) => void;
  toggleMobileSortVisible: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  isMobile,
  savedOnly,
  setSavedOnly,
  urgentOnly,
  setUrgentOnly,
  salaryRange,
  setSalaryRange,
  jobType,
  handleJobTypeChange,
  selectedLocations,
  handleLocationChange,
  toggleMobileSortVisible
}) => {
  // For desktop view
  if (!isMobile) {
    return (
      <div className="bg-card border rounded-lg p-4 space-y-5 sticky top-20">
        <div>
          <h3 className="font-medium text-sm mb-3">Job Filters</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="saved" 
                checked={savedOnly} 
                onCheckedChange={() => setSavedOnly(!savedOnly)} 
              />
              <Label htmlFor="saved" className="text-xs md:text-sm">Saved Jobs Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="urgent" 
                checked={urgentOnly} 
                onCheckedChange={() => setUrgentOnly(!urgentOnly)} 
              />
              <Label htmlFor="urgent" className="text-xs md:text-sm">Urgent Positions</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm mb-3">Salary Range (₱/day)</h3>
          <div className="space-y-4">
            <Slider
              defaultValue={[800, 2000]}
              min={500}
              max={3000}
              step={100}
              value={salaryRange}
              onValueChange={(value) => setSalaryRange(value as [number, number])}
            />
            <div className="flex justify-between text-xs">
              <span>₱{salaryRange[0]}</span>
              <span>₱{salaryRange[1]}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm mb-3">Job Type</h3>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'On-call'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={jobType.includes(type)}
                  onCheckedChange={() => handleJobTypeChange(type)}
                />
                <Label htmlFor={`type-${type}`} className="text-xs md:text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm mb-3">Location</h3>
          <div className="space-y-2">
            {['Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Pampanga'].map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox 
                  id={`location-${location}`} 
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => handleLocationChange(location)}
                />
                <Label htmlFor={`location-${location}`} className="text-xs md:text-sm">{location}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm mb-3">Shift Type</h3>
          <Select>
            <SelectTrigger className="text-xs md:text-sm h-8 md:h-9">
              <SelectValue placeholder="Any Shift Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any" className="text-xs md:text-sm">Any Shift Type</SelectItem>
                <SelectItem value="day" className="text-xs md:text-sm">Day Shift</SelectItem>
                <SelectItem value="night" className="text-xs md:text-sm">Night Shift</SelectItem>
                <SelectItem value="weekend" className="text-xs md:text-sm">Weekend</SelectItem>
                <SelectItem value="rotating" className="text-xs md:text-sm">Rotating</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full text-xs md:text-sm h-8 md:h-9">Apply Filters</Button>
      </div>
    );
  }

  // For mobile view
  return (
    <div className="fixed inset-0 bg-background z-40 p-4 md:hidden overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm">Filters</h3>
        <Button variant="ghost" size="icon" onClick={toggleMobileSortVisible}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-5">
        <div>
          <h3 className="font-medium text-xs mb-2">Job Filters</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="saved-mobile" 
                checked={savedOnly} 
                onCheckedChange={() => setSavedOnly(!savedOnly)} 
              />
              <Label htmlFor="saved-mobile" className="text-xs">Saved Jobs Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="urgent-mobile" 
                checked={urgentOnly} 
                onCheckedChange={() => setUrgentOnly(!urgentOnly)} 
              />
              <Label htmlFor="urgent-mobile" className="text-xs">Urgent Positions</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-xs mb-2">Salary Range (₱/day)</h3>
          <div className="space-y-3">
            <Slider
              defaultValue={[800, 2000]}
              min={500}
              max={3000}
              step={100}
              value={salaryRange}
              onValueChange={(value) => setSalaryRange(value as [number, number])}
            />
            <div className="flex justify-between text-[10px]">
              <span>₱{salaryRange[0]}</span>
              <span>₱{salaryRange[1]}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-xs mb-2">Job Type</h3>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'On-call'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}-mobile`} 
                  checked={jobType.includes(type)}
                  onCheckedChange={() => handleJobTypeChange(type)}
                />
                <Label htmlFor={`type-${type}-mobile`} className="text-xs">{type}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-xs mb-2">Location</h3>
          <div className="space-y-2">
            {['Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Pampanga'].map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox 
                  id={`location-${location}-mobile`} 
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => handleLocationChange(location)}
                />
                <Label htmlFor={`location-${location}-mobile`} className="text-xs">{location}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-xs mb-2">Shift Type</h3>
          <Select>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Any Shift Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any" className="text-xs">Any Shift Type</SelectItem>
                <SelectItem value="day" className="text-xs">Day Shift</SelectItem>
                <SelectItem value="night" className="text-xs">Night Shift</SelectItem>
                <SelectItem value="weekend" className="text-xs">Weekend</SelectItem>
                <SelectItem value="rotating" className="text-xs">Rotating</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-background mt-6 space-y-2">
          <Button className="w-full text-xs h-8">Apply Filters</Button>
          <Button variant="outline" className="w-full text-xs h-8" onClick={toggleMobileSortVisible}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
