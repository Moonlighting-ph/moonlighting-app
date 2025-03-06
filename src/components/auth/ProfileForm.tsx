
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Phone, Mail, Building, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormProps {
  userId?: string;
  onComplete?: () => void;
}

// Additional profile fields based on the Moonlighting.ph context
const SPECIALIZATIONS = [
  'General Medicine',
  'Nursing',
  'Emergency Medicine',
  'Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Cardiology',
  'Oncology',
  'Neurology',
  'Radiology',
  'Anesthesiology',
  'Psychiatry',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'Other'
];

const ProfileForm: React.FC<ProfileFormProps> = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Professional info
    specialization: '',
    yearsOfExperience: '',
    bio: '',
    // Location info
    address: '',
    city: '',
    region: '',
    postalCode: '',
    // Additional fields
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            specialization: data.specialization || '',
            yearsOfExperience: data.years_of_experience ? String(data.years_of_experience) : '',
            bio: data.bio || '',
            address: data.address || '',
            city: data.city || '',
            region: data.region || '',
            postalCode: data.postal_code || '',
            emergencyContact: data.emergency_contact || '',
            emergencyPhone: data.emergency_phone || '',
          });
        }
      } catch (error: any) {
        toast.error('Error loading profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.firstName || !profile.lastName) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user if userId not provided
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        currentUserId = user.id;
      }
      
      // Format the years of experience as a number if provided
      const yearsOfExperience = profile.yearsOfExperience 
        ? parseInt(profile.yearsOfExperience) 
        : null;
      
      // Update profile with all fields
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          specialization: profile.specialization,
          years_of_experience: yearsOfExperience,
          bio: profile.bio,
          address: profile.address,
          city: profile.city,
          region: profile.region,
          postal_code: profile.postalCode,
          emergency_contact: profile.emergencyContact,
          emergency_phone: profile.emergencyPhone,
        })
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      if (onComplete) onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Profile
        </CardTitle>
        <CardDescription>
          Manage your personal and professional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => updateProfile('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => updateProfile('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                  placeholder="e.g. +63 917 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={profile.emergencyContact}
                  onChange={(e) => updateProfile('emergencyContact', e.target.value)}
                  placeholder="Person to contact in case of emergency"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Number</Label>
                <Input
                  id="emergencyPhone"
                  value={profile.emergencyPhone}
                  onChange={(e) => updateProfile('emergencyPhone', e.target.value)}
                  placeholder="e.g. +63 917 123 4567"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="professional" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select 
                  value={profile.specialization} 
                  onValueChange={(value) => updateProfile('specialization', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="70"
                  value={profile.yearsOfExperience}
                  onChange={(e) => updateProfile('yearsOfExperience', e.target.value)}
                  placeholder="Years of professional experience"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  placeholder="Briefly describe your professional background and expertise"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => updateProfile('address', e.target.value)}
                  placeholder="Your street address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => updateProfile('city', e.target.value)}
                    placeholder="Your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region/Province</Label>
                  <Input
                    id="region"
                    value={profile.region}
                    onChange={(e) => updateProfile('region', e.target.value)}
                    placeholder="Your region or province"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={profile.postalCode}
                  onChange={(e) => updateProfile('postalCode', e.target.value)}
                  placeholder="Your postal code"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab('basic')} disabled={activeTab === 'basic'}>
          Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            if (activeTab === 'basic') setActiveTab('professional');
            else if (activeTab === 'professional') setActiveTab('location');
          }}
          disabled={activeTab === 'location'}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
