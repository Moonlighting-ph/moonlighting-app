
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface JobApplicationProcessProps {
  handleApply: () => void;
  existingApplication: any;
}

const JobApplicationProcess: React.FC<JobApplicationProcessProps> = ({ handleApply, existingApplication }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Process</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="font-semibold">1</span>
          </div>
          <div>
            <h3 className="font-medium">Apply Online</h3>
            <p className="text-sm text-muted-foreground">
              Submit your application through our platform
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="font-semibold">2</span>
          </div>
          <div>
            <h3 className="font-medium">Initial Screening</h3>
            <p className="text-sm text-muted-foreground">
              Our recruitment team will review your qualifications
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="font-semibold">3</span>
          </div>
          <div>
            <h3 className="font-medium">Interview</h3>
            <p className="text-sm text-muted-foreground">
              Virtual or in-person interview with the hiring manager
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="font-semibold">4</span>
          </div>
          <div>
            <h3 className="font-medium">Job Offer</h3>
            <p className="text-sm text-muted-foreground">
              If selected, you'll receive an official job offer
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={handleApply}
            disabled={!!existingApplication}
          >
            {existingApplication ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Application Submitted
              </>
            ) : (
              "Apply Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationProcess;
