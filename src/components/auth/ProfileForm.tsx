
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProfileFormProps {
  userId?: string;
  onComplete?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone || '',
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
    
    if (!profile.firstName || !profile.lastName || !profile.email) {
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
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
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
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              required
            />
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
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="e.g. +63 917 123 4567"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
