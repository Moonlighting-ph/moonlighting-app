
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationTabs } from './ApplicationTabs';

// Mock application data for demonstration
const mockApplications = [];
const isLoading = false;

const ApplicationTabsWrapper = () => {
  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <ApplicationTabs applications={mockApplications} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="applied" className="mt-6">
            <ApplicationTabs applications={mockApplications} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="upcoming" className="mt-6">
            <ApplicationTabs applications={mockApplications} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="paid" className="mt-6">
            <ApplicationTabs applications={mockApplications} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationTabsWrapper;
