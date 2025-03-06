
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AppealFormProps {
  licenseId: string;
  onSubmit: () => void;
}

const AppealForm: React.FC<AppealFormProps> = ({ licenseId, onSubmit }) => {
  const [appealReason, setAppealReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appealReason.trim()) {
      toast.error('Please provide a reason for your appeal');
      return;
    }
    
    setLoading(true);
    
    try {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase.from('verification_appeals').insert({
        user_id: session.user.id,
        license_id: licenseId,
        appeal_reason: appealReason,
      });
      
      if (error) throw error;
      
      toast.success('Appeal submitted successfully');
      onSubmit();
    } catch (error: any) {
      toast.error(error.message || 'Error submitting appeal');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Explain why you believe your license should be verified..."
          value={appealReason}
          onChange={(e) => setAppealReason(e.target.value)}
          rows={5}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Appeal'}
      </Button>
    </form>
  );
};

interface VerifyLicenseProps {
  userId: string;
}

const VerifyLicense: React.FC<VerifyLicenseProps> = ({ userId }) => {
  const [license, setLicense] = useState<any>(null);
  const [appeal, setAppeal] = useState<any>(null);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        // Get license data
        const { data: licenseData, error: licenseError } = await supabase
          .from('prc_licenses')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (licenseError && licenseError.code !== 'PGRST116') {
          throw licenseError;
        }
        
        setLicense(licenseData || null);
        
        // If license exists and was rejected, check for appeals
        if (licenseData && licenseData.status === 'rejected') {
          const { data: appealData } = await supabase
            .from('verification_appeals')
            .select('*')
            .eq('license_id', licenseData.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          setAppeal(appealData || null);
        }
      } catch (error) {
        console.error('Error fetching license data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchLicenseData();
    }
  }, [userId]);
  
  if (loading) {
    return <p>Loading license information...</p>;
  }
  
  if (!license) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PRC License Verification</CardTitle>
          <CardDescription>
            You haven't submitted your PRC license for verification yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>PRC License Verification</CardTitle>
        <CardDescription>
          Status of your PRC license verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">License Number</p>
            <p>{license.license_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Profession</p>
            <p>{license.profession}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Submission Date</p>
            <p>{new Date(license.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className={`font-semibold ${
              license.status === 'verified' ? 'text-green-600' : 
              license.status === 'rejected' ? 'text-red-600' : 
              'text-amber-600'
            }`}>
              {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
            </p>
          </div>
        </div>
        
        {license.status === 'verified' && (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-800">
              Your license has been verified! You can now apply for shifts.
            </p>
          </div>
        )}
        
        {license.status === 'pending' && (
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-800">
              Your license verification is in progress. This usually takes 24-48 hours.
            </p>
          </div>
        )}
        
        {license.status === 'rejected' && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-800">
                Your license verification was unsuccessful. You may submit an appeal.
              </p>
            </div>
            
            {appeal ? (
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Your Appeal</h4>
                <p className="text-sm mb-2">{appeal.appeal_reason}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted on {new Date(appeal.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 font-medium">
                  Status: <span className={appeal.status === 'pending' ? 'text-amber-600' : appeal.status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                    {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                  </span>
                </p>
              </div>
            ) : (
              showAppealForm ? (
                <AppealForm 
                  licenseId={license.id} 
                  onSubmit={() => setShowAppealForm(false)} 
                />
              ) : (
                <Button 
                  onClick={() => setShowAppealForm(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Submit an Appeal
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyLicense;
