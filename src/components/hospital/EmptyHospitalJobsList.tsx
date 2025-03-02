
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyHospitalJobsList: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-12 text-center border rounded-lg">
      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No job postings yet</h3>
      <p className="text-muted-foreground mt-2">
        Create your first job posting to start receiving applications
      </p>
      <Button onClick={() => navigate('/platform/hospital-jobs/new')} className="mt-6">
        Create Job Posting
      </Button>
    </div>
  );
};

export default EmptyHospitalJobsList;
