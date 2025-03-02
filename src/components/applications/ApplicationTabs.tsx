
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckSquare, Clock, DollarSign } from "lucide-react";

interface Application {
  id: string;
  created_at: string;
  status: string;
  jobs: {
    title: string;
    company: string;
    location: string;
    salary: string;
    deadline: string;
  };
}

interface ApplicationTabsProps {
  applications: Application[];
  isLoading: boolean;
}

export function ApplicationTabs({ applications, isLoading }: ApplicationTabsProps) {
  // Filter applications based on status
  const allApplications = applications;
  const appliedApplications = applications.filter(app => app.status === 'pending' || app.status === 'reviewing');
  const upcomingApplications = applications.filter(app => app.status === 'accepted');
  const paidApplications = applications.filter(app => app.status === 'completed');

  const renderApplications = (apps: Application[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (apps.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No applications found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {apps.map(app => (
          <Card key={app.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{app.jobs.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'reviewing' ? 'bg-purple-100 text-purple-800' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    app.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{app.jobs.company} • {app.jobs.location}</p>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{app.jobs.salary}</span>
                </div>
              </div>
              
              <div className="bg-muted p-4 flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Deadline: {new Date(app.jobs.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" className="flex items-center">
          <CheckSquare className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">All</span>
          <span className="ml-1">({allApplications.length})</span>
        </TabsTrigger>
        <TabsTrigger value="applied" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Applied</span>
          <span className="ml-1">({appliedApplications.length})</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center">
          <CalendarClock className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Upcoming</span>
          <span className="ml-1">({upcomingApplications.length})</span>
        </TabsTrigger>
        <TabsTrigger value="paid" className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Paid</span>
          <span className="ml-1">({paidApplications.length})</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {renderApplications(allApplications)}
      </TabsContent>
      
      <TabsContent value="applied" className="mt-6">
        {renderApplications(appliedApplications)}
      </TabsContent>
      
      <TabsContent value="upcoming" className="mt-6">
        {renderApplications(upcomingApplications)}
      </TabsContent>
      
      <TabsContent value="paid" className="mt-6">
        {renderApplications(paidApplications)}
      </TabsContent>
    </Tabs>
  );
}
