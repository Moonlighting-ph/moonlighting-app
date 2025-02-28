import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface JobFiltersProps {
  onFilterChange?: (filters: any) => void;
  className?: string;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  return (
    <div className={`bg-card rounded-lg border shadow-sm ${className}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-8"
            >
              Clear
            </Button>
          )}
          
          <CollapsibleTrigger
            asChild
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Button variant="ghost" size="sm" className="h-8 px-2">
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <Collapsible open={!isCollapsed} className="w-full">
        <CollapsibleContent>
          <div className="p-4 space-y-6">
            {/* Search Filter */}
            <div>
              <Label htmlFor="keyword" className="text-sm font-medium mb-1.5 block">
                Keyword
              </Label>
              <Input
                id="keyword"
                placeholder="Search for keywords, titles..."
                className="w-full"
              />
            </div>
            
            <Accordion type="multiple" className="w-full">
              {/* Job Type */}
              <AccordionItem value="job-type" className="border-b">
                <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                  Job Type
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`job-type-${type.toLowerCase()}`}
                          checked={activeFilters.includes(type)}
                          onCheckedChange={() => toggleFilter(type)}
                        />
                        <Label 
                          htmlFor={`job-type-${type.toLowerCase()}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Experience Level */}
              <AccordionItem value="experience" className="border-b">
                <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                  Experience Level
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  <div className="space-y-2">
                    {['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`exp-level-${level.toLowerCase().replace(' ', '-')}`}
                          checked={activeFilters.includes(level)}
                          onCheckedChange={() => toggleFilter(level)}
                        />
                        <Label 
                          htmlFor={`exp-level-${level.toLowerCase().replace(' ', '-')}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Salary Range */}
              <AccordionItem value="salary" className="border-b">
                <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                  Salary Range
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  <div className="space-y-4">
                    <div className="pt-4">
                      <Slider
                        defaultValue={[20000, 100000]}
                        max={200000}
                        min={0}
                        step={5000}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">₱0</span>
                      <span className="text-xs">₱100k</span>
                      <span className="text-xs">₱200k+</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Location */}
              <AccordionItem value="location" className="border-b">
                <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                  Location
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  <div className="space-y-3">
                    <Input placeholder="City or region..." className="w-full mb-2" />
                    <div className="space-y-2">
                      {['Remote', 'Hybrid', 'On-site'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${type.toLowerCase()}`}
                            checked={activeFilters.includes(type)}
                            onCheckedChange={() => toggleFilter(type)}
                          />
                          <Label 
                            htmlFor={`location-${type.toLowerCase()}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Specialties */}
              <AccordionItem value="specialties" className="border-b">
                <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                  Medical Specialties
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  <div className="space-y-2">
                    {['Cardiology', 'Neurology', 'Pediatrics', 'Emergency Medicine', 'Oncology', 'Surgery'].map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`specialty-${specialty.toLowerCase()}`}
                          checked={activeFilters.includes(specialty)}
                          onCheckedChange={() => toggleFilter(specialty)}
                        />
                        <Label 
                          htmlFor={`specialty-${specialty.toLowerCase()}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="pt-2">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobFilters;
