import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Calendar, DollarSign, Star, StarHalf, Filter } from "lucide-react";
import JobFilters from "./JobFilters";
import { useJobFilters, defaultJobFilter } from '@/hooks/useJobFilters';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import JobApplicationDialog from './JobApplicationDialog';

// Sample job data - will be replaced with real data from Supabase
const sampleJobs = [
  {
    id: '1',
    title: 'Emergency Room Nurse',
    facility: 'Metro Medical Center',
    location: 'Manila',
    rate: '₱1,500/hr',
    hourlyRate: 1500,
    specialization: 'nurse',
    shift: 'Night Shift (8PM-8AM)',
    date: '2024-04-20',
    urgent: true,
    description: 'Looking for an experienced ER nurse to handle high-stress emergency situations.',
    facilityRating: 4.5,
    shifts: 1
  },
  {
    id: '2',
    title: 'ICU Specialist',
    facility: 'Philippine General Hospital',
    location: 'Quezon City',
    rate: '₱1,800/hr',
    hourlyRate: 1800,
    specialization: 'doctor',
    shift: 'Day Shift (8AM-5PM)',
    date: '2024-04-22',
    urgent: false,
    description: 'ICU specialist needed for monitoring critical patients',
    facilityRating: 4.8,
    shifts: 3
  },
  {
    id: '3',
    title: 'Pediatric Nurse',
    facility: 'Children\'s Medical Center',
    location: 'Makati',
    rate: '₱1,400/hr',
    hourlyRate: 1400,
    specialization: 'nurse',
    shift: 'Afternoon Shift (2PM-10PM)',
    date: '2024-04-25',
    urgent: true,
    description: 'Caring for young patients in pediatric ward',
    facilityRating: 4.2,
    shifts: 2
  },
  {
    id: '4',
    title: 'Medical Technologist',
    facility: 'St. Luke\'s Medical Center',
    location: 'Taguig',
    rate: '₱1,300/hr',
    hourlyRate: 1300,
    specialization: 'medical_technologist',
    shift: 'Morning Shift (6AM-2PM)',
    date: '2024-04-28',
    urgent: false,
    description: 'Lab work and sample analysis',
    facilityRating: 4.7,
    shifts: 5
  },
  {
    id: '5',
    title: 'Radiologic Technologist',
    facility: 'Makati Medical Center',
    location: 'Makati',
    rate: '₱1,600/hr',
    hourlyRate: 1600,
    specialization: 'radiologic_technologist',
    shift: 'Rotating Shifts',
    date: '2024-04-30',
    urgent: true,
    description: 'Operating X-ray and MRI equipment',
    facilityRating: 4.6,
    shifts: 4
  },
  {
    id: '6',
    title: 'Physical Therapist',
    facility: 'Philippine Orthopedic Center',
    location: 'Quezon City',
    rate: '₱1,450/hr',
    hourlyRate: 1450,
    specialization: 'physical_therapist',
    shift: 'Day Shift (9AM-5PM)',
    date: '2024-05-02',
    urgent: false,
    description: 'Rehabilitation therapy for orthopedic patients',
    facilityRating: 4.3,
    shifts: 5
  },
];

const JobBoard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  // Use our custom hook for filtering jobs
  const { filters, updateFilter, resetFilters, filteredJobs } = useJobFilters(
    sampleJobs,
    defaultJobFilter
  );

  const handleApply = (jobId: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this job",
      });
      navigate('/auth/login');
      return true; // Return true to indicate the action was handled
    }
    return false; // Return false to allow the dialog to open
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-3xl font-bold text-primary mb-3 md:mb-0">Available Shifts</h2>
          <Button 
            variant="outline" 
            onClick={toggleFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && (
          <JobFilters
            filters={filters}
            onUpdateFilter={updateFilter}
            onResetFilters={resetFilters}
            totalJobs={sampleJobs.length}
            filteredCount={filteredJobs.length}
          />
        )}
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No matching jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
            <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      {job.urgent && (
                        <Badge variant="destructive" className="mb-2">
                          Urgent
                        </Badge>
                      )}
                      <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        {job.facility}
                        <span className="mx-1">•</span>
                        {renderRating(job.facilityRating)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                      <span className="font-medium text-green-600">{job.rate}</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{job.shift}</span>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{new Date(job.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm line-clamp-2 text-muted-foreground pt-1">
                    {job.description}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex flex-col gap-2">
                  <JobApplicationDialog 
                    job={job}
                    triggerText="Apply Now"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {job.shifts === 1 ? '1 shift available' : `${job.shifts} shifts available`}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobBoard;
