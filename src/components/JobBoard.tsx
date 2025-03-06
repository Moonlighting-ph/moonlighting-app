
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JobBoard: React.FC = () => {
  // Sample job data - will be replaced with real data from Supabase
  const sampleJobs = [
    {
      id: '1',
      title: 'Emergency Room Nurse',
      facility: 'Metro Medical Center',
      location: 'Manila',
      rate: '₱1,500/hr',
      shift: 'Night Shift (8PM-8AM)',
      date: 'Apr 20, 2024',
      urgent: true,
    },
    {
      id: '2',
      title: 'ICU Specialist',
      facility: 'Philippine General Hospital',
      location: 'Quezon City',
      rate: '₱1,800/hr',
      shift: 'Day Shift (8AM-5PM)',
      date: 'Apr 22, 2024',
      urgent: false,
    },
    {
      id: '3',
      title: 'Pediatric Nurse',
      facility: 'Children\'s Medical Center',
      location: 'Makati',
      rate: '₱1,400/hr',
      shift: 'Afternoon Shift (2PM-10PM)',
      date: 'Apr 25, 2024',
      urgent: true,
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-primary mb-8">Available Shifts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                {job.urgent && (
                  <div className="mb-2">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Urgent
                    </span>
                  </div>
                )}
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.facility}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rate:</span>
                    <span className="font-medium text-green-600">{job.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shift:</span>
                    <span className="font-medium">{job.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{job.date}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobBoard;
