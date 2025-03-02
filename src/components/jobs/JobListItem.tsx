
import React from 'react';
import { ArrowRight, MapPin, Clock, DollarSign, User, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface JobListItemProps {
  job: {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    deadline: string;
    urgent: boolean;
    applicants?: number;
  };
  isSaved: boolean;
  toggleSaved: (jobId: string) => void;
  formatDeadline: (deadline: string) => string;
}

const JobListItem: React.FC<JobListItemProps> = ({ 
  job, 
  isSaved, 
  toggleSaved, 
  formatDeadline 
}) => {
  const navigate = useNavigate();
  
  const viewJobDetail = (jobId: string) => {
    navigate(`/platform/job/${jobId}`);
  };

  return (
    <Card className="overflow-hidden">
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
                  className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
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
  );
};

export default JobListItem;
