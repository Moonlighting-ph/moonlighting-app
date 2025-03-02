
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserApplications } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApplicationTabs from './ApplicationTabs';

const ApplicationTabsWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: applications = [], isLoading, error, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchUserApplications
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading applications...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Applications</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading your applications.
        </p>
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }
  
  const pending = applications.filter(app => app.status === 'pending');
  const upcoming = applications.filter(app => app.status === 'accepted' && new Date(app.jobs.deadline) > new Date());
  const completed = applications.filter(app => app.status === 'accepted' && new Date(app.jobs.deadline) <= new Date());
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">
          All ({applications.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Applied ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Upcoming ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completed.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ApplicationTabs applications={applications} />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationTabs applications={pending} />
      </TabsContent>
      
      <TabsContent value="upcoming">
        <ApplicationTabs applications={upcoming} />
      </TabsContent>
      
      <TabsContent value="completed">
        <ApplicationTabs applications={completed} />
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationTabsWrapper;
