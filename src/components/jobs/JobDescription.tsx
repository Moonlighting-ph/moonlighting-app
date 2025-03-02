
import React from 'react';
import { CheckCircle2, Tag } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobDescriptionProps {
  description: string;
  requirements: string[];
  benefits: string[];
  qualifications?: string[];
  handleApply: () => void;
  existingApplication: any;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ 
  description, 
  requirements, 
  benefits,
  qualifications,
  handleApply, 
  existingApplication 
}) => {
  // Separate tag-style qualifications (with #) from regular ones
  const tags = qualifications?.filter(q => q.startsWith('#')) || [];
  const regularQualifications = qualifications?.filter(q => !q.startsWith('#')) || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>{description}</p>
        
        {(regularQualifications.length > 0 || tags.length > 0) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Qualifications</h3>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {regularQualifications.length > 0 && (
              <ul className="space-y-2">
                {regularQualifications.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
          <ul className="space-y-2">
            {requirements.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Benefits</h3>
          <ul className="space-y-2">
            {benefits.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <div className="mt-6 mb-6 flex justify-center">
        <Button 
          className="w-full md:w-auto mx-6" 
          onClick={handleApply}
          disabled={!!existingApplication}
        >
          {existingApplication ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Already Applied
            </>
          ) : (
            "Apply Now"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default JobDescription;
