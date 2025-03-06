
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PRC_PROFESSIONS = [
  'Medical Doctor',
  'Registered Nurse',
  'Medical Technologist',
  'Radiologic Technologist',
  'Pharmacist',
  'Physical Therapist',
  'Occupational Therapist',
  'Dentist',
  'Midwife',
  'Other'
];

const PrcLicenseForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    profession: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.licenseNumber || !formData.profession) {
      toast.error('Please complete all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Submit license information
      const { error } = await supabase.from('prc_licenses').insert({
        user_id: user.id,
        license_number: formData.licenseNumber,
        profession: formData.profession,
      });
      
      if (error) throw error;
      
      toast.success('PRC license submitted for verification');
    } catch (error: any) {
      toast.error(error.message || 'Error submitting license information');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>PRC License Verification</CardTitle>
        <CardDescription>
          Please provide your PRC license information for verification.
          This is required for all healthcare professionals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Healthcare Profession</Label>
            <Select 
              value={formData.profession} 
              onValueChange={(value) => setFormData({...formData, profession: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                {PRC_PROFESSIONS.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">PRC License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              placeholder="Enter your PRC license number"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Your license will be verified within 24-48 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrcLicenseForm;
