import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample job data
const jobListings = [
  {
    id: 'job1',
    title: 'Emergency Room Nurse',
    company: 'Metro Manila General Hospital',
    logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200&h=200&fit=crop',
    location: 'Quezon City, Metro Manila',
    type: 'Full-time / Night Shift',
    salary: '₱900/day + ₱6,000–₱11,000 incentives',
    deadline: '3 days left',
    applicants: 12,
    description: 'We are looking for a registered nurse to join our emergency department. The ideal candidate has experience in fast-paced care environments and strong triage skills.',
    requirements: [
      'BSN Degree and PRC License',
      'Min. 2 years ER experience',
      'BLS and ACLS Certification',
      'Excellent communication skills'
    ],
    benefits: [
      'Free meals during shift',
      'Transportation allowance',
      'SSS, PhilHealth, Pag-IBIG',
      '13th month pay'
    ],
    urgent: true,
    saved: false
  },
  {
    id: 'job2',
    title: 'ICU Nurse',
    company: 'St. Luke\'s Medical Center',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&h=200&fit=crop',
    location: 'Taguig, Metro Manila',
    type: 'Part-time / Weekend',
    salary: '₱1,100/day',
    deadline: '5 days left',
    applicants: 8,
    description: 'Join our intensive care unit team providing specialized care for critically ill patients. Seeking compassionate nurses with strong clinical assessment skills.',
    requirements: [
      'BSN Degree and PRC License',
      'Min. 3 years ICU experience',
      'BLS, ACLS, and CCRN Certification',
      'Experience with ventilators and critical care equipment'
    ],
    benefits: [
      'Free meals and accommodations',
      'Hazard pay',
      'Healthcare coverage',
      'Professional development allowance'
    ],
    urgent: false,
    saved: true
  },
  {
    id: 'job3',
    title: 'General Practitioner',
    company: 'Philippine General Hospital',
    logo: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b3583?q=80&w=200&h=200&fit=crop',
    location: 'Manila',
    type: 'Full-time / Day Shift',
    salary: '₱1,500/day',
    deadline: '1 week left',
    applicants: 5,
    description: 'Seeking a licensed physician to provide primary care services including routine check-ups, basic medical procedures, and patient education.',
    requirements: [
      'MD Degree and PRC License',
      'Completed residency program',
      'Min. 2 years clinical experience',
      'Excellent bedside manner'
    ],
    benefits: [
      'Competitive salary package',
      'Full healthcare coverage',
      'Retirement plan',
      'Continuing education support'
    ],
    urgent: true,
    saved: false
  },
  {
    id: 'job4',
    title: 'Pediatric Specialist',
    company: 'Children\'s Medical Center',
    logo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=200&h=200&fit=crop',
    location: 'Quezon City',
    type: 'Part-time / Flexible Hours',
    salary: '₱2,000/day',
    deadline: '2 weeks left',
    applicants: 3,
    description: 'Pediatric specialist needed to provide comprehensive care for children and adolescents. Focus on developmental assessments, preventive care, and managing childhood illnesses.',
    requirements: [
      'MD with Pediatric specialization',
      'Board certification',
      'Min. 3 years pediatric practice',
      'Excellent communication with children and parents'
    ],
    benefits: [
      'Flexible scheduling',
      'Professional liability insurance',
      'Continuing education allowance',
      'Performance bonuses'
    ],
    urgent: false,
    saved: false
  },
  {
    id: 'job5',
    title: 'Cardiac Nurse',
    company: 'Philippine Heart Center',
    logo: 'https://images.unsplash.com/photo-1516549655669-8289983d0f9b?q=80&w=200&h=200&fit=crop',
    location: 'Quezon City, Metro Manila',
    type: 'Full-time / Rotating Shifts',
    salary: '₱950/day + incentives',
    deadline: '1 week left',
    applicants: 7,
    description: 'Seeking a specialized cardiac nurse to provide care for patients with cardiovascular conditions. Responsibilities include monitoring cardiac status, administering medications, and patient education.',
    requirements: [
      'BSN Degree and PRC License',
      'Cardiac care certification preferred',
      'Experience with cardiac monitoring equipment',
      'Strong critical thinking skills'
    ],
    benefits: [
      'Specialized training opportunities',
      'Full benefits package',
      'Career advancement path',
      'Competitive compensation'
    ],
    urgent: false,
    saved: true
  }
];

const Jobs = () => {
  const [savedOnly, setSavedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState([800, 2000]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Filter jobs based on selected filters
  const filteredJobs = jobListings.filter(job => {
    // Filter by search term
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by saved
    if (savedOnly && !job.saved) {
      return false;
    }
    
    // Filter by urgent
    if (urgentOnly && !job.urgent) {
      return false;
    }
    
    // More filters would be implemented here (salary, job type, location)
    
    return true;
  });
  
  // Toggle job saved status
  const toggleSaved = (jobId: string) => {
    // In a real app, this would update the saved status in the database
    console.log(`Toggled saved status for job ${jobId}`);
  };
  
  // Toggle filter panel visibility on mobile
  const toggleMobileSortVisible = () => {
    setMobileSortVisible(!mobileSortVisible);
  };
  
  // Handle job type selection
  const handleJobTypeChange = (type: string) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };
  
  // Handle location selection
  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

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
        {/* Filters - Desktop */}
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
        
        {/* Filters - Mobile */}
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
        
        {/* Job Listings */}
        <div className="md:col-span-9 lg:col-span-9 space-y-4">
          {filteredJobs.length > 0 ? (
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
              
              {filteredJobs.map((job) => (
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
                            onClick={() => toggleSaved(job.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${job.saved ? 'fill-red-500 text-red-500' : ''}`} 
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
                            <span>{job.applicants} applicants</span>
                          </div>
                        </div>
                        
                        <p className="text-xs md:text-sm mt-3 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{job.deadline}</span> to apply
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-8 w-full sm:w-auto">
                          View Details
                        </Button>
                        <Button size="sm" className="text-xs h-8 w-full sm:w-auto">
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
