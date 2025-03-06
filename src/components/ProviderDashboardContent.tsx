
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProviderDashboardContent: React.FC = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Provider Dashboard</h2>
          <Button size="lg">Post New Job</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">4</CardTitle>
              <CardDescription>Active Job Posts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">12</CardTitle>
              <CardDescription>Total Applications</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">3</CardTitle>
              <CardDescription>Filled Positions</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Your Job Posts</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((job) => (
            <Card key={job} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <CardHeader className="flex-1 pb-2">
                  <CardTitle>Emergency Room Nurse #{job}</CardTitle>
                  <CardDescription>Posted 3 days ago • 5 applicants</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-2 p-4">
                  <Button variant="outline">View Applicants</Button>
                  <Button variant="secondary">Edit</Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProviderDashboardContent;
