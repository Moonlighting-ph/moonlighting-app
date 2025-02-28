import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Calendar,
  Briefcase,
  FileText,
  Users,
  Edit,
  Camera,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const HospitalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hospital Profile</h1>
          <p className="text-muted-foreground">
            View and manage your hospital's profile
          </p>
        </div>
        <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="relative pt-0 px-0 overflow-hidden">
              <div className="h-48 bg-primary/10 relative">
                <img 
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=400&fit=crop" 
                  alt="Hospital Cover"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <Button size="sm" className="absolute bottom-4 right-4">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Cover
                  </Button>
                )}
              </div>
              <div className="px-6 pb-4 pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 relative rounded-md bg-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200&h=200&fit=crop" alt="Metro Manila General Hospital" />
                  <AvatarFallback>MMGH</AvatarFallback>
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Metro Manila General Hospital</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Quezon City, Metro Manila</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <span>General Hospital</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>500+ beds</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">JCI Accredited</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800">Verified</Badge>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800">Top Employer</Badge>
              </div>
              
              <p className="text-sm leading-relaxed mb-6">
                Metro Manila General Hospital is a leading healthcare institution committed to providing quality medical care to patients. Our hospital is equipped with state-of-the-art facilities and staffed by experienced medical professionals. We pride ourselves on our patient-centered approach and our commitment to excellence in healthcare delivery.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">+63 (2) 8123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">hr@mmgh.ph</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-muted-foreground">www.mmgh.ph</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Operating Hours</p>
                    <p className="text-sm text-muted-foreground">24 hours, 7 days a week</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About the Hospital</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Established</p>
                      <p className="text-muted-foreground">1975</p>
                    </div>
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">General Hospital</p>
                    </div>
                    <div>
                      <p className="font-medium">Hospital Size</p>
                      <p className="text-muted-foreground">500+ beds</p>
                    </div>
                    <div>
                      <p className="font-medium">Employees</p>
                      <p className="text-muted-foreground">1,000+</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold pt-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-muted/50">Emergency Medicine</Badge>
                  <Badge className="bg-muted/50">Cardiology</Badge>
                  <Badge className="bg-muted/50">Neurology</Badge>
                  <Badge className="bg-muted/50">Pediatrics</Badge>
                  <Badge className="bg-muted/50">Oncology</Badge>
                  <Badge className="bg-muted/50">Surgery</Badge>
                  <Badge className="bg-muted/50">Obstetrics & Gynecology</Badge>
                  <Badge className="bg-muted/50">Orthopedics</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="open-positions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="open-positions">Open Positions</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="open-positions" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">Current Job Openings</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-base font-medium">Emergency Room Nurse</h4>
                          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800">Urgent</Badge>
                        </div>
                        <div className="flex flex-wrap mt-1 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>Quezon City</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Full-time / Night Shift</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Posted 2 days ago</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">We are seeking a registered nurse to join our emergency department. The ideal candidate has experience in fast-paced care environments and strong triage skills.</p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 sm:self-start">
                        <Button size="sm" variant="default">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="text-base font-medium">ICU Nurse</h4>
                        <div className="flex flex-wrap mt-1 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>Quezon City</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Full-time / Rotating Shifts</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Posted 1 week ago</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">Join our intensive care unit team providing specialized care for critically ill patients. Seeking compassionate nurses with strong clinical assessment skills.</p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 sm:self-start">
                        <Button size="sm" variant="default">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="text-base font-medium">Medical Technologist</h4>
                        <div className="flex flex-wrap mt-1 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>Quezon City</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Full-time / Day Shift</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Posted 3 days ago</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">Looking for a licensed medical technologist to perform laboratory tests and procedures. Experience with hematology and clinical chemistry preferred.</p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 sm:self-start">
                        <Button size="sm" variant="default">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline">View All Open Positions (12)</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="facilities" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">Hospital Facilities</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1516549655669-8289983d0f9b?w=500&h=300&fit=crop" 
                        alt="Emergency Department"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Emergency Department</h4>
                    <p className="text-sm text-muted-foreground">24/7 Emergency Services</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=500&h=300&fit=crop" 
                        alt="Intensive Care Unit"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Intensive Care Unit</h4>
                    <p className="text-sm text-muted-foreground">Advanced Critical Care</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=500&h=300&fit=crop" 
                        alt="Surgical Suite"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Surgical Suite</h4>
                    <p className="text-sm text-muted-foreground">State-of-the-art Operating Rooms</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1551601651-3a317c467fb0?w=500&h=300&fit=crop" 
                        alt="Diagnostic Imaging"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Diagnostic Imaging</h4>
                    <p className="text-sm text-muted-foreground">Advanced Imaging Technology</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=500&h=300&fit=crop" 
                        alt="Maternity Ward"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Maternity Ward</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive Maternal Care</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="h-40 rounded-md overflow-hidden mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=300&fit=crop" 
                        alt="Laboratory"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">Clinical Laboratory</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive Diagnostic Testing</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Hospital Reviews</h3>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium">4.7</span>
                  <span className="text-sm text-muted-foreground">(128 reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-3xl font-bold">4.7</span>
                      <div className="flex my-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs text-muted-foreground">128 reviews</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-24 text-sm">Excellent</span>
                        <div className="flex-1 mx-2">
                          <Progress value={75} className="h-2" />
                        </div>
                        <span className="text-sm">75%</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-24 text-sm">Very Good</span>
                        <div className="flex-1 mx-2">
                          <Progress value={15} className="h-2" />
                        </div>
                        <span className="text-sm">15%</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-24 text-sm">Average</span>
                        <div className="flex-1 mx-2">
                          <Progress value={5} className="h-2" />
                        </div>
                        <span className="text-sm">5%</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-24 text-sm">Poor</span>
                        <div className="flex-1 mx-2">
                          <Progress value={3} className="h-2" />
                        </div>
                        <span className="text-sm">3%</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-24 text-sm">Terrible</span>
                        <div className="flex-1 mx-2">
                          <Progress value={2} className="h-2" />
                        </div>
                        <span className="text-sm">2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="font-medium">John Doe</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>July 15, 2023</span>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                        <p className="text-sm">I worked as an ER nurse at MMGH for 2 years and it was a great learning experience. The management is supportive and they provide excellent opportunities for professional growth. The work environment is fast-paced but collaborative.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="font-medium">Jane Smith</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>June 22, 2023</span>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm">Metro Manila General Hospital offers competitive salaries and good benefits. The hospital has excellent facilities and equipment. The only downside is that shifts can be quite demanding during peak seasons, but the team spirit makes up for it.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" />
                        <AvatarFallback>MR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="font-medium">Mark Rodriguez</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>May 3, 2023</span>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                        <p className="text-sm">Working in the ICU department at MMGH was a rewarding experience. The hospital invests in continuous education and training for staff. The management is responsive to employees' concerns and the hospital culture promotes work-life balance.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Stats</CardTitle>
              <CardDescription>
                Key information about the hospital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Founded</p>
                  <p className="text-2xl font-bold">1975</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Beds</p>
                  <p className="text-2xl font-bold">500+</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Staff</p>
                  <p className="text-2xl font-bold">1,000+</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Departments</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hiring Stats</CardTitle>
              <CardDescription>
                Current hiring activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Open Positions</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Urgent Positions</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Recent Hires (30 days)</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Average Response Time</span>
                  <span className="font-semibold">2 days</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">Hiring by Department</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Nursing</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Medical Technologists</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Physicians</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Admin Staff</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Hospital address and directions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg overflow-hidden h-40">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Quezon+City,Philippines&zoom=14&size=400x200&markers=color:red%7CQuezon+City,Philippines&key=YOUR_API_KEY" 
                  alt="Map Location"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-1 text-sm">
                <p className="font-medium">Metro Manila General Hospital</p>
                <p className="text-muted-foreground">123 Health Avenue, Cubao</p>
                <p className="text-muted-foreground">Quezon City, Metro Manila</p>
                <p className="text-muted-foreground">Philippines, 1109</p>
              </div>
              
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
