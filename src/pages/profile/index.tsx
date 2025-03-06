
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileForm from '@/components/auth/ProfileForm';
import PrcLicenseForm from '@/components/auth/PrcLicenseForm';
import PrcVerificationStatus from '@/components/auth/PrcVerificationStatus';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserProfile } from '@/types/profile';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [licenseId, setLicenseId] = useState<string | null>(null);
  
  // Fetch profile data using Tanstack Query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as UserProfile;
    },
    enabled: !!session?.user?.id
  });
  
  // Fetch license data
  const { data: license, isLoading: licenseLoading } = useQuery({
    queryKey: ['license', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching license:', error);
        throw error;
      }
      
      if (data) {
        setLicenseId(data.id);
      }
      
      return data;
    },
    enabled: !!session?.user?.id && profile?.user_type === 'moonlighter'
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);
  
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }
  
  const handleVerificationComplete = () => {
    setShowVerificationForm(false);
    setShowAppealForm(false);
    toast.success('Information submitted successfully');
    // Refetch license data after submission
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-primary mb-8">Your Profile</h2>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                {profile?.user_type === 'moonlighter' && (
                  <TabsTrigger value="license">PRC License</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileForm userId={session?.user?.id} />
              </TabsContent>
              
              {profile?.user_type === 'moonlighter' && (
                <TabsContent value="license">
                  {showVerificationForm ? (
                    <PrcLicenseForm onComplete={handleVerificationComplete} />
                  ) : showAppealForm ? (
                    <PrcLicenseForm 
                      isAppeal 
                      licenseId={licenseId || undefined} 
                      onComplete={handleVerificationComplete} 
                    />
                  ) : licenseLoading ? (
                    <Card className="w-full max-w-md mx-auto">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-32 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : license ? (
                    <div className="space-y-4">
                      <PrcVerificationStatus 
                        userId={session?.user?.id || ''} 
                      />
                      
                      {license.status === 'rejected' && (
                        <div className="flex justify-center mt-4">
                          <button 
                            onClick={() => setShowAppealForm(true)}
                            className="text-primary hover:underline text-sm"
                          >
                            Submit an appeal
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <PrcVerificationStatus 
                      userId={session?.user?.id || ''} 
                      onStartVerification={() => setShowVerificationForm(true)}
                    />
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Profile;
