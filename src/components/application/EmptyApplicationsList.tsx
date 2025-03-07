
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Inbox, PlusCircle } from 'lucide-react';

const EmptyApplicationsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="text-center pb-0">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Inbox className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-semibold">No Applications Yet</CardTitle>
        <CardDescription className="text-muted-foreground">
          You haven't received any job applications yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pt-4 pb-8">
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Start by posting a job to attract qualified healthcare professionals. 
          Once you've posted a job, applications will appear here.
        </p>
        <Button 
          onClick={() => navigate('/provider/post-job')}
          className="px-4 py-2 inline-flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Post a New Job
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyApplicationsList;
