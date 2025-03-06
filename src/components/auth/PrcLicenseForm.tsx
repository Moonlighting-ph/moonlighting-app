
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, FileText, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

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

interface PrcLicenseFormProps {
  onComplete?: () => void;
  isAppeal?: boolean;
  licenseId?: string;
}

const PrcLicenseForm: React.FC<PrcLicenseFormProps> = ({ 
  onComplete, 
  isAppeal = false,
  licenseId
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    profession: '',
    appealReason: '',
    supportingDocuments: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAppeal && (!formData.licenseNumber || !formData.profession)) {
      toast.error('Please complete all required fields');
      return;
    }

    if (isAppeal && (!formData.appealReason)) {
      toast.error('Please provide a reason for your appeal');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (isAppeal) {
        if (!licenseId) {
          throw new Error('License ID is required for appeals');
        }

        // Handle file upload if provided
        let supportingDocumentsUrls = null;
        if (formData.supportingDocuments) {
          const fileExt = formData.supportingDocuments.name.split('.').pop();
          const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('license-documents')
            .upload(fileName, formData.supportingDocuments);
          
          if (uploadError) throw uploadError;
          
          supportingDocumentsUrls = {
            url: uploadData.path
          };
        }
        
        // Submit appeal
        const { error } = await supabase.from('verification_appeals').insert({
          user_id: user.id,
          license_id: licenseId,
          appeal_reason: formData.appealReason,
          supporting_documents: supportingDocumentsUrls
        });
        
        if (error) throw error;
        
        toast.success('Your appeal has been submitted for review');
      } else {
        // Submit new license information
        const { error, data } = await supabase.from('prc_licenses').insert({
          user_id: user.id,
          license_number: formData.licenseNumber,
          profession: formData.profession,
        }).select().single();
        
        if (error) throw error;
        
        toast.success('PRC license submitted for verification');
      }
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error submitting information');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, supportingDocuments: e.target.files[0]});
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isAppeal ? 'PRC License Verification Appeal' : 'PRC License Verification'}
        </CardTitle>
        <CardDescription>
          {isAppeal 
            ? 'Submit additional information to help verify your PRC license'
            : 'Please provide your PRC license information for verification. This is required for all healthcare professionals.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAppeal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="profession">Healthcare Profession*</Label>
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
                <Label htmlFor="licenseNumber">PRC License Number*</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  placeholder="Enter your PRC license number"
                />
              </div>
            </>
          )}
          
          {isAppeal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="appealReason">Reason for Appeal*</Label>
                <Textarea
                  id="appealReason"
                  value={formData.appealReason}
                  onChange={(e) => setFormData({...formData, appealReason: e.target.value})}
                  placeholder="Please explain why your license should be verified"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportingDocuments">Supporting Documents</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="supportingDocuments"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload documents that can help verify your license (PDF, JPG, PNG)
                  </p>
                </div>
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isAppeal ? 'Submitting Appeal...' : 'Submitting...'}
              </>
            ) : (
              isAppeal ? 'Submit Appeal' : 'Submit for Verification'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground text-center">
          {isAppeal 
            ? 'Your appeal will be reviewed within 2-3 business days.'
            : 'Your license will be verified within 24-48 hours.'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PrcLicenseForm;
