
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileForm from '@/components/auth/ProfileForm';
import PrcLicenseForm from '@/components/auth/PrcLicenseForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [hasPrcLicense, setHasPrcLicense] = useState<boolean>(false);
  
  useEffect(() => {
    const getUserDetails = async () => {
      if (!session?.user) {
        return;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setUserType(profile.user_type);
      }
      
      // Check if user has a PRC license (for moonlighters)
      if (profile?.user_type === 'moonlighter') {
        const { data: license } = await supabase
          .from('prc_licenses')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        setHasPrcLicense(!!license);
      }
    };
    
    if (session) {
      getUserDetails();
    }
  }, [session]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
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
                {userType === 'moonlighter' && (
                  <TabsTrigger value="license">PRC License</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileForm userId={session?.user?.id} />
              </TabsContent>
              
              {userType === 'moonlighter' && (
                <TabsContent value="license">
                  {!hasPrcLicense ? (
                    <PrcLicenseForm />
                  ) : (
                    <Card className="w-full max-w-md mx-auto">
                      <CardHeader>
                        <CardTitle>PRC License Status</CardTitle>
                        <CardDescription>
                          Your PRC license has been submitted for verification
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center text-amber-600 font-medium py-4">
                          Your license is currently being verified. 
                          This process may take 24-48 hours.
                        </p>
                      </CardContent>
                    </Card>
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
