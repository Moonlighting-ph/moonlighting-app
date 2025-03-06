
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Type for registration data
type RegistrationData = {
  name: string;
  email: string;
  type: 'provider' | 'moonlighter';
  profession?: string;
  phone?: string;
};

const WaitlistForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    type: 'moonlighter',
    profession: '',
    phone: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic form validation
      if (!formData.name || !formData.email || !formData.type) {
        toast.error('Please fill out all required fields');
        setIsSubmitting(false);
        return;
      }

      // Submit to Supabase
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            type: formData.type,
            profession: formData.profession,
            phone: formData.phone,
          },
        ]);

      if (error) {
        console.error('Error submitting waitlist registration:', error);
        if (error.code === '23505') {
          toast.error('This email is already registered on our waitlist');
        } else {
          toast.error('There was an error submitting your registration');
        }
        setIsSubmitting(false);
        return;
      }

      // Success!
      toast.success('Thank you for joining our waitlist!');
      setFormData({
        name: '',
        email: '',
        type: 'moonlighter',
        profession: '',
        phone: '',
      });
      
    } catch (error) {
      console.error('Error in waitlist submission:', error);
      toast.error('There was an error submitting your registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Join Our Waitlist</CardTitle>
        <CardDescription>
          Be the first to know when Moonlighting.ph launches. Get early access to our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name*</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address*</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">I am a*</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="provider">Healthcare Provider</SelectItem>
                <SelectItem value="moonlighter">Healthcare Professional (Moonlighter)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession">Medical Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="e.g., Nurse, Doctor, Physical Therapist"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;
