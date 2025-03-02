
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface JobListHeaderProps {
  title: string;
  subtitle: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleMobileSortVisible: () => void;
  totalJobs: number;
  filteredCount: React.ReactNode;
}

const JobListHeader: React.FC<JobListHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  toggleMobileSortVisible,
  totalJobs,
  filteredCount
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden text-xs h-8"
            onClick={toggleMobileSortVisible}
          >
            <Filter className="h-3 w-3 mr-2" />
            Filters
          </Button>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs, keywords..."
              className="pl-8 md:pl-10 text-xs md:text-sm h-8 md:h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredCount && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs md:text-sm text-muted-foreground">
            Showing {filteredCount} of {totalJobs} jobs
          </p>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[140px] text-xs md:text-sm h-8 md:h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="relevance" className="text-xs md:text-sm">Relevance</SelectItem>
                <SelectItem value="recent" className="text-xs md:text-sm">Most Recent</SelectItem>
                <SelectItem value="salary-high" className="text-xs md:text-sm">Salary (High to Low)</SelectItem>
                <SelectItem value="salary-low" className="text-xs md:text-sm">Salary (Low to High)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default JobListHeader;
