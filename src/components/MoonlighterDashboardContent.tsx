
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MoonlighterDashboardContent: React.FC = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Moonlighter Dashboard</h2>
          <Button size="lg" variant="secondary">Find Shifts</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">7</CardTitle>
              <CardDescription>Applied Jobs</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">3</CardTitle>
              <CardDescription>Upcoming Shifts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">₱15,000</CardTitle>
              <CardDescription>Earnings This Month</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Upcoming Shifts</h3>
        <div className="space-y-4 mb-8">
          {[1, 2, 3].map((shift) => (
            <Card key={shift} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <CardHeader className="flex-1 pb-2">
                  <CardTitle>ICU Nurse Shift #{shift}</CardTitle>
                  <CardDescription>Metro Medical Center • Apr 28, 2024 • 8AM-5PM</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-2 p-4">
                  <Button variant="outline">View Details</Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Job Applications</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((app) => (
            <Card key={app} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <CardHeader className="flex-1 pb-2">
                  <CardTitle>Pediatric Nurse #{app}</CardTitle>
                  <CardDescription>Children's Hospital • Applied on Apr 15, 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-2 p-4">
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoonlighterDashboardContent;
