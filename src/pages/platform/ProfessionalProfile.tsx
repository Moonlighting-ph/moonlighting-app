import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Link as LinkIcon,
  FileBadge,
  FileText,
  Heart,
  Clock,
  Edit,
  Camera,
  Plus,
  Pencil,
  CheckCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfessionalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Professional Profile</h1>
          <p className="text-muted-foreground">View and manage your professional information</p>
        </div>
        <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="relative pt-0 px-0 overflow-hidden">
              <div className="h-48 bg-primary/10 relative">
                <img 
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&h=400&fit=crop" 
                  alt="Profile Cover"
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
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 relative">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&crop=faces" alt="Maria Santos" />
                  <AvatarFallback>MS</AvatarFallback>
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Maria Santos</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>Registered Nurse</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Quezon City, Metro Manila</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">Registered Nurse</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800">PRC Licensed</Badge>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800">BLS Certified</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800">ACLS Certified</Badge>
              </div>
              
              <p className="text-sm leading-relaxed mb-6">
                Experienced nurse with 5+ years of clinical experience across various healthcare settings including emergency departments and intensive care units. Passionate about providing quality patient care with a focus on improving healthcare outcomes. Skilled in critical care procedures and patient education.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">maria.santos@email.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+63 917 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">Quezon City, Metro Manila</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">Weekends, Night Shifts</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About Me</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-muted-foreground">5+ years</p>
                    </div>
                    <div>
                      <p className="font-medium">Languages</p>
                      <p className="text-muted-foreground">English, Filipino</p>
                    </div>
                    <div>
                      <p className="font-medium">Specialties</p>
                      <p className="text-muted-foreground">Critical Care, Emergency</p>
                    </div>
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-muted-foreground">BSN, University of the Philippines</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold pt-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-muted/50">Patient Assessment</Badge>
                  <Badge className="bg-muted/50">Medication Administration</Badge>
                  <Badge className="bg-muted/50">Critical Care</Badge>
                  <Badge className="bg-muted/50">Vital Signs Monitoring</Badge>
                  <Badge className="bg-muted/50">Patient Education</Badge>
                  <Badge className="bg-muted/50">IV Therapy</Badge>
                  <Badge className="bg-muted/50">Emergency Response</Badge>
                  <Badge className="bg-muted/50">Wound Care</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="experience">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experience" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-medium">Emergency Room Nurse</h4>
                          <Badge variant="outline" className="text-xs w-fit">Current</Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Metro Manila General Hospital</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>January 2021 - Present</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Quezon City, Metro Manila</span>
                        </div>
                        <p className="text-sm">Provide emergency nursing care to patients of all ages, triage patients to determine priority of care, administer medications and treatments, monitor vital signs, and collaborate with healthcare team.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Staff Nurse</h4>
                        <p className="text-sm font-medium text-muted-foreground mb-1">St. Luke's Medical Center</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>June 2018 - December 2020</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Taguig, Metro Manila</span>
                        </div>
                        <p className="text-sm">Provided direct patient care in medical-surgical unit, administered medications, maintained patient records, assisted with procedures, and collaborated with interdisciplinary team.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Nurse Trainee</h4>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Philippine General Hospital</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>January 2018 - May 2018</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Manila</span>
                        </div>
                        <p className="text-sm">Completed clinical rotations in various departments including pediatrics, obstetrics, medical-surgical, and psychiatric units under supervision of experienced nurses.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Bachelor of Science in Nursing</h4>
                        <p className="text-sm font-medium text-muted-foreground mb-1">University of the Philippines Manila</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>2014 - 2018</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Manila</span>
                        </div>
                        <p className="text-sm">Graduated with honors. Active member of the Nursing Students Association. Participated in community health outreach programs.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Critical Care Nursing Certificate Program</h4>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Philippine Nurses Association</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>2019</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Quezon City, Metro Manila</span>
                        </div>
                        <p className="text-sm">Completed intensive training in critical care nursing practices, emergency protocols, and advanced patient monitoring techniques.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="certifications" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Certifications & Licenses</h3>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileBadge className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-medium">Philippine Nursing License</h4>
                          <Badge variant="outline" className="text-xs w-fit">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Professional Regulation Commission (PRC)</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Issued Jun 2018</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Expires Jun 2024</span>
                        </div>
                        <p className="text-sm">License Number: RN-123456</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileBadge className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-medium">Basic Life Support (BLS) Certification</h4>
                          <Badge variant="outline" className="text-xs w-fit">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">American Heart Association</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Issued Sep 2022</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Expires Sep 2024</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileBadge className="h-6 w-6 text-primary" />
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-medium">Advanced Cardiovascular Life Support (ACLS)</h4>
                          <Badge variant="outline" className="text-xs w-fit">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">American Heart Association</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Issued Oct 2022</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Expires Oct 2024</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Statistics</CardTitle>
              <CardDescription>
                Your profile visibility and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Profile Views</p>
                  <p className="text-2xl font-bold">243</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Job Applications</p>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-green-600">5 active</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Interviews</p>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-amber-600">2 upcoming</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Saved Jobs</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>
                Complete your profile to increase visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Basic Information</span>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">100%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Work Experience</span>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">100%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Education</span>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">100%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Certifications</span>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">100%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Skills</span>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">75%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">References</span>
                  <Badge variant="outline" className="text-[10px]">0%</Badge>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ratings & Reviews</CardTitle>
              <CardDescription>
                How employers have rated your work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold flex items-center justify-center">
                    4.8
                    <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Professionalism</span>
                    <span>4.9</span>
                  </div>
                  <Progress value={98} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Technical Skills</span>
                    <span>4.8</span>
                  </div>
                  <Progress value={96} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Communication</span>
                    <span>4.7</span>
                  </div>
                  <Progress value={94} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Reliability</span>
                    <span>4.9</span>
                  </div>
                  <Progress value={98} className="h-1" />
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                <span>View All Reviews</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                Your current work status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
                Available for Work
              </Badge>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Preferred Shifts</span>
                  <span className="font-medium">Night Shifts, Weekends</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Minimum Rate</span>
                  <span className="font-medium">₱850/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Max Hours/Week</span>
                  <span className="font-medium">40 hrs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Notice Period</span>
                  <span className="font-medium">1 week</span>
                </div>
              </div>
              
              {isEditing && (
                <Button size="sm" className="w-full mt-2">
                  Update Availability
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
