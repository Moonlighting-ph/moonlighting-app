import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  CreditCard, 
  Globe, 
  Settings as SettingsIcon,
  LogOut, 
  Shield,
  Edit,
  Check,
  Copy,
  ArrowRight,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile data
  const [formData, setFormData] = useState({
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+63 917 123 4567',
    bio: 'Experienced nurse with 8+ years of clinical experience across various healthcare settings. Passionate about providing quality patient care with a focus on improving healthcare outcomes.',
    location: 'Quezon City, Metro Manila',
    language: 'English, Filipino',
    profession: 'Registered Nurse',
    specialization: 'Emergency Care',
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 917 123 4567',
      bio: 'Experienced nurse with 8+ years of clinical experience across various healthcare settings. Passionate about providing quality patient care with a focus on improving healthcare outcomes.',
      location: 'Quezon City, Metro Manila',
      language: 'English, Filipino',
      profession: 'Registered Nurse',
      specialization: 'Emergency Care',
    });
  };
  
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };
  
  // Toggle notification setting
  const toggleNotification = (setting) => {
    toast({
      title: "Setting Updated",
      description: `${setting} notifications have been updated.`,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full max-w-md grid grid-cols-4 mb-4 md:mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Update your personal information and public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      {isEditing ? (
                        <Select
                          value={formData.profession}
                          onValueChange={(value) => setFormData({...formData, profession: value})}
                        >
                          <SelectTrigger id="profession">
                            <SelectValue placeholder="Select your profession" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Registered Nurse">Registered Nurse</SelectItem>
                            <SelectItem value="Doctor">Doctor</SelectItem>
                            <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                            <SelectItem value="Medical Technologist">Medical Technologist</SelectItem>
                            <SelectItem value="Caregiver">Caregiver</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="profession"
                          value={formData.profession}
                          readOnly
                          className="bg-muted"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      {isEditing ? (
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => setFormData({...formData, specialization: value})}
                        >
                          <SelectTrigger id="specialization">
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                            <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Surgery">Surgery</SelectItem>
                            <SelectItem value="General Practice">General Practice</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          readOnly
                          className="bg-muted"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted resize-none" : "resize-none"}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your bio will be displayed on your public profile.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Languages</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple languages with commas.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Connect your accounts for easier sign-in and more features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        f
                      </div>
                      <span className="ml-2">Facebook</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                        g
                      </div>
                      <div className="ml-2">
                        <span>Google</span>
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <span className="ml-2">LinkedIn</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profile Visibility</CardTitle>
                  <CardDescription>
                    Control how your profile is seen by others
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to hospitals and potential employers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Reviews</p>
                      <p className="text-sm text-muted-foreground">
                        Display ratings and reviews on your public profile
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Available for Work</p>
                      <p className="text-sm text-muted-foreground">
                        Indicate that you're currently available for new opportunities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all of your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your profile picture and public information
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&crop=faces" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">Maria Santos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {formData.profession} specializing in {formData.specialization}
                  </p>
                  <div className="w-full border p-3 rounded-lg bg-muted/50 flex items-center mb-2">
                    <span className="text-xs text-muted-foreground truncate flex-1">moonlighting.ph/profile/maria-santos</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('moonlighting.ph/profile/maria-santos')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Public Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                      <span className="ml-2 font-medium">Verified Account</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <span className="ml-2 font-medium">PRC Licensed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control which notifications you receive and how they're delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new job opportunities that match your profile
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Job Alerts')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your job applications
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Application Updates')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications when you get new messages
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Message Emails')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Receive our monthly newsletter with industry insights
                      </p>
                    </div>
                    <Switch onCheckedChange={() => toggleNotification('Newsletter')} />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications about your job applications
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Application Push')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Message Push')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Invitations</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications when employers invite you to apply
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toggleNotification('Job Invitations Push')} />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Notification Delivery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-4">
                      <Smartphone className="h-5 w-5 mr-2 text-muted-foreground" />
                      <p className="font-medium">Mobile App</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Device</p>
                      <p className="text-sm font-medium">iPhone 13 Pro</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Last Active</p>
                      <p className="text-sm font-medium">Today, 10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-4">
                      <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                      <p className="font-medium">Web Browser</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Browser</p>
                      <p className="text-sm font-medium">Chrome on macOS</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Last Active</p>
                      <p className="text-sm font-medium">Now</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and view transaction history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Your Payment Methods</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-3">
                        Visa
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed rounded-lg flex items-center justify-center">
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Billing History</h3>
                  <Button variant="outline" size="sm">
                    Download All
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 text-sm font-medium grid grid-cols-5">
                    <div className="col-span-2">Description</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Receipt</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                      <div className="col-span-2">Pro Subscription</div>
                      <div>Aug 1, 2023</div>
                      <div>₱1,999.00</div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                      <div className="col-span-2">Pro Subscription</div>
                      <div>Jul 1, 2023</div>
                      <div>₱1,999.00</div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                      <div className="col-span-2">Pro Subscription</div>
                      <div>Jun 1, 2023</div>
                      <div>₱1,999.00</div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account's security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" value="••••••••" readOnly className="bg-muted" />
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication
                </p>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app to generate one-time codes
                      </p>
                    </div>
                  </div>
                  <Button>Enable</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a code via SMS to verify your identity
                      </p>
                    </div>
                  </div>
                  <Button>Enable</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Login Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These are the devices that are currently logged into your account
                </p>
                
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">Chrome on MacOS</p>
                        <Badge className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
                          Current
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last active: Just now • Manila, Philippines
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Sign Out
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-sm text-muted-foreground">
                        Last active: Today, 10:45 AM • Manila, Philippines
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Firefox on Windows</p>
                      <p className="text-sm text-muted-foreground">
                        Last active: Yesterday, 6:30 PM • Manila, Philippines
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline">Sign Out From All Devices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
