
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface JobCompanyInfoProps {
  company: string;
  logo: string;
  location: string;
}

const JobCompanyInfo: React.FC<JobCompanyInfoProps> = ({ company, logo, location }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{company}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-border mr-4">
            <img 
              src={logo}
              alt={company}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Healthcare Institution
            </p>
          </div>
        </div>
        
        <p>A leading healthcare institution providing quality medical services to patients.</p>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <p className="text-muted-foreground">
            {location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCompanyInfo;
