
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationTabsWrapper from '@/components/applications/ApplicationTabsWrapper';

const MyApplications = () => {
  return (
    <div className="container px-4 py-6 md:py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Track and manage your job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationTabsWrapper />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyApplications;
