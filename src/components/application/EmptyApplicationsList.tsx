
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

const EmptyApplicationsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-md border border-gray-100 bg-white">
      <CardContent className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="rounded-full bg-blue-50 p-3 mb-4">
          <ClipboardList className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't received any applications yet. Post a new job to attract qualified healthcare professionals.
        </p>
        <Button 
          onClick={() => navigate('/provider/post-job')}
          className="px-6"
        >
          Post a New Job
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyApplicationsList;
