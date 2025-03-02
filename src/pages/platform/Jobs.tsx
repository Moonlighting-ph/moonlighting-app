import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  User, 
  Star, 
  Filter, 
  X,
  Heart,
  Building,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchJobs, checkJobApplication } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent: boolean;
  created_at: string;
  applicants?: number;
}

const Jobs = () => {
  const [savedOnly, setSavedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState([800, 2000]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: jobListings = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const filteredJobs = jobListings.filter((job: Job) => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (savedOnly && !savedJobs.includes(job.id)) {
      return false;
    }
    
    if (urgentOnly && !job.urgent) {
      return false;
    }
    
    if (jobType.length > 0) {
      let matchesType = false;
      for (const type of jobType) {
        if (job.type.toLowerCase().includes(type.toLowerCase())) {
          matchesType = true;
          break;
        }
      }
      if (!matchesType) return false;
    }
    
    if (selectedLocations.length > 0) {
      let matchesLocation = false;
      for (const location of selectedLocations) {
        if (job.location.toLowerCase().includes(location.toLowerCase())) {
          matchesLocation = true;
          break;
        }
      }
      if (!matchesLocation) return false;
    }
    
    return true;
  });
  
  const toggleSaved = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  const toggleMobileSortVisible = () => {
    setMobileSortVisible(!mobileSortVisible);
  };
  
  const handleJobTypeChange = (type: string) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };
  
  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const viewJobDetail = (jobId: string) => {
    navigate(`/platform/job/${jobId}`);
  };

  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day to apply';
    if (diffDays === 1) return '1 day left';
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return `Apply by ${deadlineDate.toLocaleDateString()}`;
  };

  if (error) {
    return (
      <div className="container px-4 py-6 md:py-8">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Jobs</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading job listings. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Browse Jobs</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Find the perfect healthcare job opportunity
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
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="md:col-span-3 lg:col-span-3 hidden md:block">
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
        </div>
        
        {mobileSortVisible && (
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
        )}
        
        <div className="md:col-span-9 lg:col-span-9 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading jobs...</span>
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Showing {filteredJobs.length} of {jobListings.length} jobs
                </p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[140px] text-xs md:text-sm h-8 md:h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance" className="text-xs md:text-sm">Relevance</SelectItem>
                    <SelectItem value="recent" className="text-xs md:text-sm">Most Recent</SelectItem>
                    <SelectItem value="salary-high" className="text-xs md:text-sm">Salary (High to Low)</SelectItem>
                    <SelectItem value="salary-low" className="text-xs md:text-sm">Salary (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredJobs.map((job: Job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 md:h-20 md:w-20 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={job.logo} 
                            alt={job.company}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="font-medium text-base">{job.title}</h3>
                              {job.urgent && (
                                <Badge variant="destructive" className="uppercase text-[10px]">Urgent</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="self-start h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaved(job.id);
                            }}
                          >
                            <Heart 
                              className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                            <span className="sr-only">Save job</span>
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.type}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.salary}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{job.applicants || 0} applicants</span>
                          </div>
                        </div>
                        
                        <p className="text-xs md:text-sm mt-3 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{formatDeadline(job.deadline)}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-8 w-full sm:w-auto"
                          onClick={() => viewJobDetail(job.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-xs h-8 w-full sm:w-auto"
                          onClick={() => viewJobDetail(job.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="text-xs md:text-sm h-8 md:h-9">
                  Load More Jobs
                </Button>
              </div>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No jobs found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                We couldn't find any jobs matching your filters. Try adjusting your search criteria.
              </p>
              <Button onClick={() => {
                setSavedOnly(false);
                setUrgentOnly(false);
                setSearchTerm('');
                setSalaryRange([800, 2000]);
                setJobType([]);
                setSelectedLocations([]);
              }}>
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
