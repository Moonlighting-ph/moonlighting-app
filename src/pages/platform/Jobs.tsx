
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
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">
            Find the perfect healthcare job opportunity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileSortVisible}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs, keywords..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters - Desktop */}
        <div className="md:col-span-3 lg:col-span-3 hidden md:block">
          <div className="bg-card border rounded-lg p-5 space-y-6 sticky top-20">
            <div>
              <h3 className="font-medium mb-3">Job Filters</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="saved" 
                    checked={savedOnly} 
                    onCheckedChange={() => setSavedOnly(!savedOnly)} 
                  />
                  <Label htmlFor="saved">Saved Jobs Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="urgent" 
                    checked={urgentOnly} 
                    onCheckedChange={() => setUrgentOnly(!urgentOnly)} 
                  />
                  <Label htmlFor="urgent">Urgent Positions</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Salary Range (₱/day)</h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[800, 2000]}
                  min={500}
                  max={3000}
                  step={100}
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange(value as [number, number])}
                />
                <div className="flex justify-between">
                  <span className="text-sm">₱{salaryRange[0]}</span>
                  <span className="text-sm">₱{salaryRange[1]}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Job Type</h3>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Contract', 'On-call'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={jobType.includes(type)}
                      onCheckedChange={() => handleJobTypeChange(type)}
                    />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Location</h3>
              <div className="space-y-2">
                {['Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Pampanga'].map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`location-${location}`} 
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={() => handleLocationChange(location)}
                    />
                    <Label htmlFor={`location-${location}`}>{location}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Shift Type</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any Shift Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any Shift Type</SelectItem>
                    <SelectItem value="day">Day Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                    <SelectItem value="rotating">Rotating</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
        
        {/* Filters - Mobile */}
        {mobileSortVisible && (
          <div className="fixed inset-0 bg-background z-40 p-4 md:hidden overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="icon" onClick={toggleMobileSortVisible}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Job Filters</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saved-mobile" 
                      checked={savedOnly} 
                      onCheckedChange={() => setSavedOnly(!savedOnly)} 
                    />
                    <Label htmlFor="saved-mobile">Saved Jobs Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="urgent-mobile" 
                      checked={urgentOnly} 
                      onCheckedChange={() => setUrgentOnly(!urgentOnly)} 
                    />
                    <Label htmlFor="urgent-mobile">Urgent Positions</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Salary Range (₱/day)</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[800, 2000]}
                    min={500}
                    max={3000}
                    step={100}
                    value={salaryRange}
                    onValueChange={(value) => setSalaryRange(value as [number, number])}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm">₱{salaryRange[0]}</span>
                    <span className="text-sm">₱{salaryRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Job Type</h3>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'On-call'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}-mobile`} 
                        checked={jobType.includes(type)}
                        onCheckedChange={() => handleJobTypeChange(type)}
                      />
                      <Label htmlFor={`type-${type}-mobile`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <div className="space-y-2">
                  {['Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Pampanga'].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`location-${location}-mobile`} 
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => handleLocationChange(location)}
                      />
                      <Label htmlFor={`location-${location}-mobile`}>{location}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Shift Type</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Shift Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="any">Any Shift Type</SelectItem>
                      <SelectItem value="day">Day Shift</SelectItem>
                      <SelectItem value="night">Night Shift</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="rotating">Rotating</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={toggleMobileSortVisible}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Job Listings */}
        <div className="md:col-span-9 lg:col-span-9">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} jobs
            </p>
            <Select defaultValue="relevant">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 lg:w-1/5 p-6 flex flex-col items-center justify-center bg-accent/30">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-border mb-2">
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-center">{job.company}</h3>
                    </div>
                    
                    <div className="p-6 md:w-3/4 lg:w-4/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h2 className="text-xl font-semibold">{job.title}</h2>
                            {job.urgent && (
                              <Badge variant="destructive">URGENT</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={job.saved ? "text-red-500" : "text-muted-foreground"}
                          onClick={() => toggleSaved(job.id)}
                        >
                          <Heart className={job.saved ? "fill-current" : ""} />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/5 font-normal">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 2 && (
                          <Badge variant="outline" className="bg-primary/5 font-normal">
                            +{job.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {job.deadline}
                          </div>
                          <div className="text-muted-foreground">
                            <User className="h-4 w-4 inline mr-1" />
                            {job.applicants} applicants
                          </div>
                        </div>
                        <Button>
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any jobs matching your current filters. Try adjusting your search or check back later for new opportunities.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm('');
                setSavedOnly(false);
                setUrgentOnly(false);
                setSalaryRange([800, 2000]);
                setJobType([]);
                setSelectedLocations([]);
              }}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {filteredJobs.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="mr-2">
                Previous
              </Button>
              <Button variant="outline" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline">
                2
              </Button>
              <Button variant="outline">
                3
              </Button>
              <Button variant="outline" className="ml-2">
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
