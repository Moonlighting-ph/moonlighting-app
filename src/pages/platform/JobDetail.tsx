
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Award,
  Briefcase,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample job data
const jobData = {
  id: 'job1',
  title: 'Emergency Room Nurse - Night Shift',
  company: 'Metro Manila General Hospital',
  logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200&h=200&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=200&fit=crop',
  location: {
    address: '123 Health Avenue',
    city: 'Quezon City',
    province: 'Metro Manila',
  },
  type: 'Full-time',
  schedule: 'Night Shift (10:00 PM - 6:00 AM)',
  salary: '₱900/day + ₱6,000–₱11,000 incentives per cutoff',
  postedDate: '2023-07-15',
  deadline: '2023-08-15',
  applicants: 12,
  status: 'urgent',
  description: 'Metro Manila General Hospital is seeking a qualified registered nurse to join our emergency department night shift team. The ideal candidate will be responsible for providing high-quality patient care in a fast-paced environment, collaborating with healthcare providers, and ensuring patient safety and satisfaction.',
  responsibilities: [
    'Assess patients\' conditions and provide appropriate nursing interventions',
    'Administer medications and treatments as prescribed by physicians',
    'Monitor and document patients\' conditions and responses to treatments',
    'Coordinate with healthcare team members to ensure comprehensive patient care',
    'Respond promptly to emergency situations',
    'Provide patient and family education',
    'Maintain accurate and complete medical records'
  ],
  requirements: [
    'Bachelor of Science in Nursing (BSN)',
    'Current PRC license as a Registered Nurse',
    'BLS (Basic Life Support) certification',
    'ACLS (Advanced Cardiac Life Support) certification preferred',
    'Minimum of 2 years experience in emergency or acute care setting',
    'Excellent assessment and critical thinking skills',
    'Strong communication and interpersonal skills',
    'Ability to work in a fast-paced environment and handle stressful situations'
  ],
  benefits: [
    'Competitive salary package with incentives',
    'Free meals during shifts',
    'Transportation allowance',
    'Healthcare coverage for employee and dependents',
    'SSS, PhilHealth, and Pag-IBIG contributions',
    '13th month pay',
    'Annual performance bonus',
    'Continuous professional development opportunities'
  ],
  aboutCompany: 'Metro Manila General Hospital is a 300-bed tertiary care facility providing comprehensive healthcare services to the community since 1985. Our emergency department is equipped with state-of-the-art medical technology and staffed by skilled healthcare professionals dedicated to providing the highest quality of care to our patients.',
  paymentInfo: {
    method: 'Direct deposit',
    frequency: 'Bi-monthly',
    nextDate: 'August 15, 2023'
  },
  companyRating: 4.2,
  reviewCount: 45,
  similarJobs: [
    {
      id: 'job2',
      title: 'ICU Nurse',
      company: 'St. Luke\'s Medical Center',
      location: 'Taguig, Metro Manila',
      salary: '₱1,100/day',
      type: 'Part-time / Weekend'
    },
    {
      id: 'job3',
      title: 'ER Nurse - Day Shift',
      company: 'Makati Medical Center',
      location: 'Makati, Metro Manila',
      salary: '₱950/day',
      type: 'Full-time / Day Shift'
    },
    {
      id: 'job4',
      title: 'Trauma Nurse',
      company: 'The Medical City',
      location: 'Pasig, Metro Manila',
      salary: '₱1,000/day',
      type: 'Full-time / Rotating Shifts'
    }
  ]
};

const JobDetail = () => {
  const { id } = useParams();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // For a real app, we would fetch job details based on the id
  console.log(`Viewing job with id: ${id}`);
  
  const toggleSaved = () => {
    setIsSaved(!isSaved);
  };
  
  const handleApply = () => {
    setIsApplying(true);
    // In a real app, this would open an application form or modal
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    console.log('Share job');
  };

  return (
    <div className="container px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/platform/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </a>
      </Button>
      
      {/* Job Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-40 overflow-hidden relative">
          <img 
            src={jobData.coverImage}
            alt={jobData.company}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-background bg-white">
              <img 
                src={jobData.logo}
                alt={jobData.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{jobData.title}</h1>
              <p className="text-lg">{jobData.company}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.location.city}, {jobData.location.province}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.type}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.schedule}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.salary}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span>Posted: {new Date(jobData.postedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mr-2" />
                <span>Apply by: {new Date(jobData.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.applicants} applicants</span>
              </div>
              {jobData.status === 'urgent' && (
                <Badge variant="destructive" className="uppercase">Urgent</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="flex-1 sm:flex-none" onClick={handleApply}>
              Apply Now
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={toggleSaved}>
              <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? 'Saved' : 'Save Job'}
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Job Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
              <TabsTrigger value="payment" className="flex-1">Payment Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>{jobData.description}</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {jobData.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {jobData.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {jobData.benefits.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-center">
                <Button className="w-full md:w-auto" onClick={handleApply}>
                  Apply Now
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{jobData.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-border mr-4">
                      <img 
                        src={jobData.logo}
                        alt={jobData.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl font-semibold mr-2">{jobData.companyRating}</span>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(jobData.companyRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-gray-300'}`} 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">({jobData.reviewCount} reviews)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on employee reviews
                      </p>
                    </div>
                  </div>
                  
                  <p>{jobData.aboutCompany}</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Location</h3>
                    <p className="text-muted-foreground">
                      {jobData.location.address}, {jobData.location.city}, {jobData.location.province}
                    </p>
                    <div className="mt-3 h-48 bg-accent rounded-lg">
                      {/* In a real app, this would be a Google Map */}
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Map view would appear here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                      <p className="text-lg">{jobData.paymentInfo.method}</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Frequency</h3>
                      <p className="text-lg">{jobData.paymentInfo.frequency}</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Next Payout</h3>
                      <p className="text-lg">{jobData.paymentInfo.nextDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Salary Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Base Daily Rate</span>
                        <span className="font-semibold">₱900</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Night Differential</span>
                        <span className="font-semibold">+10%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Performance Incentive</span>
                        <span className="font-semibold">Up to ₱6,000</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Attendance Bonus</span>
                        <span className="font-semibold">Up to ₱5,000</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Transportation Allowance</span>
                        <span className="font-semibold">₱100/day</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Meal Allowance</span>
                        <span className="font-semibold">Free meals during shift</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Estimated Monthly Earnings</h3>
                    <p className="text-3xl font-bold">₱27,000 - ₱40,000</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on 20 working days per month plus incentives
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Apply Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application through our platform
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Initial Screening</h3>
                  <p className="text-sm text-muted-foreground">
                    Our recruitment team will review your qualifications
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Interview</h3>
                  <p className="text-sm text-muted-foreground">
                    Virtual or in-person interview with the hiring manager
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Job Offer</h3>
                  <p className="text-sm text-muted-foreground">
                    If selected, you'll receive an official job offer
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {jobData.similarJobs.map((job) => (
                  <a 
                    key={job.id} 
                    href={`/platform/job/${job.id}`}
                    className="block px-4 py-3 hover:bg-accent transition-colors"
                  >
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Meet the Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&crop=faces" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Anna Navarro, RN</p>
                    <p className="text-sm text-muted-foreground">ER Department Head</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&crop=faces" />
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. Jose Reyes</p>
                    <p className="text-sm text-muted-foreground">ER Physician</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&crop=faces" />
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Maria Luna</p>
                    <p className="text-sm text-muted-foreground">HR Manager</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
