
import React from 'react';
import { MapPin, Briefcase, DollarSign, Calendar, CalendarIcon, Heart, Share2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface JobHeaderProps {
  job: {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    salary: string;
    created_at: string;
    deadline: string;
    urgent: boolean;
  };
  isSaved: boolean;
  toggleSaved: () => void;
  handleShare: () => void;
  existingApplication: any;
  handleApply: () => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({ 
  job, 
  isSaved, 
  toggleSaved, 
  handleShare, 
  existingApplication, 
  handleApply 
}) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={job.logo}
          alt={job.company}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-background bg-white">
            <img 
              src={job.logo}
              alt={job.company}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-lg">{job.company}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Apply by: {new Date(job.deadline).toLocaleDateString()}</span>
            </div>
            {job.urgent && (
              <Badge variant="destructive" className="uppercase">Urgent</Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6">
          <Button 
            className="flex-1 sm:flex-none" 
            onClick={handleApply}
            disabled={!!existingApplication}
          >
            {existingApplication ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Applied
              </>
            ) : (
              "Apply Now"
            )}
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={toggleSaved}>
            <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            {isSaved ? 'Saved' : 'Save Job'}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobHeader;
