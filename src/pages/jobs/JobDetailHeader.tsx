
import React from 'react';
import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, CalendarClock, DollarSign } from 'lucide-react';

interface JobDetailHeaderProps {
  job: Job;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
          
          {job.is_urgent && (
            <Badge variant="destructive" className="mt-2 lg:mt-0">
              Urgent
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center text-gray-600">
            <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
            <span>{job.type}</span>
          </div>
          
          {job.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.salary && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
              <span>{job.salary}</span>
            </div>
          )}
          
          {job.posted_date && (
            <div className="flex items-center text-gray-600">
              <CalendarClock className="h-5 w-5 mr-2 text-gray-500" />
              <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailHeader;
