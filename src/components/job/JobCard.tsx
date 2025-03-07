
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface JobCardProps {
  job: Job;
  userType: string | null;
  onApply: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, userType, onApply }) => {
  const navigate = useNavigate();

  const handleViewJob = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="cursor-pointer" onClick={handleViewJob}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          {job.is_urgent && (
            <Badge variant="destructive" className="ml-2">Urgent</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow cursor-pointer" onClick={handleViewJob}>
        <p className="mb-4 text-sm line-clamp-3">{job.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">{job.type}</Badge>
          {job.specialization && <Badge variant="secondary">{job.specialization}</Badge>}
          {job.experience_level && (
            <Badge variant="outline" className="bg-blue-50">
              {job.experience_level}
            </Badge>
          )}
        </div>
        {job.location && <p className="text-sm text-gray-500 mb-1">📍 {job.location}</p>}
        {job.salary && <p className="text-sm text-gray-500 mb-1">💰 {job.salary}</p>}
        {job.posted_date && (
          <p className="text-xs text-gray-400 mt-2">
            Posted {new Date(job.posted_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleViewJob}
        >
          View Details
        </Button>
        {userType === 'moonlighter' && (
          <Button 
            onClick={() => onApply(job)} 
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
