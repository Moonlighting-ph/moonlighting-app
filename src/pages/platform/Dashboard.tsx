
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import JobListingsPreview from "@/components/JobListingsPreview";
import { 
  BriefcaseMedical, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Bell, 
  Clock, 
  Building, 
  User, 
  ChevronRight, 
  ArrowUpRight,
  ClipboardCheck,
  FileSearch,
  BarChartHorizontal,
  CheckCircle2
} from 'lucide-react';

const Dashboard = () => {
  // Activity data for the chart
  const activityData = [
    { name: 'Mon', applications: 2, interviews: 0 },
    { name: 'Tue', applications: 5, interviews: 1 },
    { name: 'Wed', applications: 3, interviews: 0 },
    { name: 'Thu', applications: 0, interviews: 2 },
    { name: 'Fri', applications: 4, interviews: 1 },
    { name: 'Sat', applications: 1, interviews: 0 },
    { name: 'Sun', applications: 0, interviews: 0 },
  ];
  
  // Job application status data for pie chart
  const statusData = [
    { name: 'Applied', value: 15, color: '#94a3b8' },
    { name: 'Reviewing', value: 8, color: '#3b82f6' },
    { name: 'Interview', value: 4, color: '#8b5cf6' },
    { name: 'Offer', value: 2, color: '#10b981' },
  ];
  
  // Recommended job listings
  const recommendedJobs = [
    {
      id: 'job1',
      title: 'ICU Nurse',
      company: 'St. Luke\'s Medical Center',
      logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&h=200&fit=crop',
      location: 'Quezon City, Philippines',
      type: 'Full-time',
      description: 'Join our team of dedicated healthcare professionals in our state-of-the-art Intensive Care Unit. Seeking experienced RNs with critical care background.',
    },
    {
      id: 'job2',
      title: 'Head Nurse - Cardiology',
      company: 'Philippine Heart Center',
      logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200&h=200&fit=crop',
      location: 'Manila, Philippines',
      type: 'Full-time',
      description: 'Lead our dedicated cardiology nursing team. The ideal candidate has 5+ years of cardiac care experience and strong leadership skills.',
    },
    {
      id: 'job3',
      title: 'Pediatric Nurse Practitioner',
      company: 'Makati Medical Center',
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&h=200&fit=crop',
      location: 'Makati City, Philippines',
      type: 'Full-time',
      description: 'We\'re looking for a compassionate Pediatric NP to join our growing children\'s health department. Must have specialty certification.',
    },
    {
      id: 'job4',
      title: 'Emergency Room Nurse',
      company: 'Philippine General Hospital',
      logo: 'https://images.unsplash.com/photo-1580281657702-257584239a42?q=80&w=200&h=200&fit=crop',
      location: 'Manila, Philippines',
      type: 'Full-time',
      description: 'Fast-paced ER environment seeking skilled nurses. Trauma experience preferred. Various shifts available.',
    }
  ];
  
  // Upcoming events
  const upcomingEvents = [
    {
      id: 'event1',
      title: 'Interview with St. Luke\'s Medical Center',
      date: 'Tomorrow, 10:00 AM',
      location: 'Video Call'
    },
    {
      id: 'event2',
      title: 'Medical Certification Renewal',
      date: 'July 15, 2023',
      location: 'Online'
    },
    {
      id: 'event3',
      title: 'Healthcare Job Fair',
      date: 'July 22, 2023',
      location: 'SMX Convention Center'
    }
  ];
  
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Maria! Here's what's happening with your job search.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            {/* Hide Messages button for MVP */}
            <Button variant="outline" size="sm" className="h-9 gap-1.5 hidden">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </Button>
            <Button size="sm" className="h-9 gap-1.5">
              <BriefcaseMedical className="h-4 w-4" />
              <span className="hidden sm:inline">Find Jobs</span>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-2 mb-2">
                <FileSearch className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-xl md:text-2xl font-bold">15</div>
              <p className="text-xs md:text-sm text-muted-foreground">Applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-blue-500/10 p-2 mb-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              </div>
              <div className="text-xl md:text-2xl font-bold">4</div>
              <p className="text-xs md:text-sm text-muted-foreground">Interviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-purple-500/10 p-2 mb-2">
                <Building className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div className="text-xl md:text-2xl font-bold">8</div>
              <p className="text-xs md:text-sm text-muted-foreground">Saved Jobs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-500/10 p-2 mb-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              </div>
              <div className="text-xl md:text-2xl font-bold">2</div>
              <p className="text-xs md:text-sm text-muted-foreground">Job Offers</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Hide Activity Chart for MVP */}
            <Card className="hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-md md:text-lg font-medium flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
                    Activity Overview
                  </div>
                  <Tabs defaultValue="weekly" className="w-auto">
                    <TabsList className="grid w-full grid-cols-3 h-8">
                      <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardTitle>
                <CardDescription>Your job application activity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[260px] w-full px-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommended Jobs Card - Essential for MVP */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md md:text-lg font-medium flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BriefcaseMedical className="h-4 w-4 text-muted-foreground" />
                    Recommended Jobs
                  </div>
                  <Button variant="link" size="sm" className="gap-1 text-xs" asChild>
                    <a href="/platform/jobs">
                      View all 
                      <ChevronRight className="h-3 w-3" />
                    </a>
                  </Button>
                </CardTitle>
                <CardDescription>Based on your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-md border overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover object-center" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">{job.title}</h3>
                          <Badge variant="outline" className="rounded-sm text-[10px] h-5 px-1.5">
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{job.company} • {job.location}</p>
                        <p className="text-xs line-clamp-1">{job.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card - Essential for MVP */}
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&crop=faces&fit=crop" />
                    <AvatarFallback>MN</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">Maria Natividad, RN</h3>
                  <p className="text-sm text-muted-foreground mb-4">Critical Care Nurse • Manila, Philippines</p>
                  
                  <div className="w-full space-y-2 mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Profile Completion</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Status Card - Essential for MVP */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md md:text-lg font-medium">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[170px] flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {statusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="text-xs">{status.name}</span>
                      <span className="text-xs font-medium">{status.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Events - Essential for MVP as they relate to job applications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md md:text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="bg-primary/10 text-primary rounded-md p-2 h-min">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
