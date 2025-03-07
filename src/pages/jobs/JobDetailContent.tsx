
import React from 'react';
import { Job } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobDetailContentProps {
  job: Job;
}

const JobDetailContent: React.FC<JobDetailContentProps> = ({ job }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{job.description}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {(job.responsibilities as string[]).map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {(job.requirements as string[]).map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.specialization && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Specialization</p>
                <Badge variant="secondary">{job.specialization}</Badge>
              </div>
            )}
            
            {job.experience_level && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                <Badge variant="outline">{job.experience_level}</Badge>
              </div>
            )}
            
            {job.deadline && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
                <p>{new Date(job.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailContent;
