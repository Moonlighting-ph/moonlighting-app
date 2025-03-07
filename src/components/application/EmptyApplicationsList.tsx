
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const EmptyApplicationsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-gray-500 mb-4">You haven't received any applications yet.</p>
        <Button onClick={() => navigate('/provider/post-job')}>
          Post a New Job
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyApplicationsList;
