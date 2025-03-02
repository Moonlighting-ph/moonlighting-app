
import React from 'react';
import { fetchUserApplications } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicationTabs } from '@/components/applications/ApplicationTabs';

export default function MyApplications() {
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['user-applications'],
    queryFn: fetchUserApplications,
  });

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
            <div className="bg-red-100 text-red-800 p-3 rounded-full mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Error Loading Applications</h3>
            <p className="text-muted-foreground text-center mb-6">
              We couldn't load your applications. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Applications</h1>
        <Link to="/platform/jobs">
          <Button>Browse More Jobs</Button>
        </Link>
      </div>

      {applications.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
            <div className="bg-blue-100 text-blue-800 p-3 rounded-full mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't applied to any jobs yet. Browse available jobs and start applying!
            </p>
            <Link to="/platform/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ApplicationTabs applications={applications} isLoading={isLoading} />
      )}
    </div>
  );
}
