import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

const MakePaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { session, loading } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;
      
      try {
        setApplicationLoading(true);
        
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            jobs(*),
            profiles:moonlighter_id(first_name, last_name, email)
          `)
          .eq('id', applicationId)
          .single();
        
        if (error) throw error;
        
        // Verify this application is for a job posted by the current user
        if (data?.jobs?.provider_id !== session?.user?.id) {
          toast.error("You don't have permission to access this application");
          navigate('/provider');
          return;
        }
        
        setApplication(data);
      } catch (error: any) {
        console.error('Error fetching application:', error);
        toast.error('Failed to load application details');
      } finally {
        setApplicationLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchApplication();
    }
  }, [applicationId, session, navigate]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      navigate('/provider');
    }, 3000);
  };

  if (loading || applicationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                className="mb-4" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <h1 className="text-3xl font-bold text-primary">Make Payment</h1>
            </div>
            
            {paymentSuccess ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Recorded Successfully</h2>
                    <p className="text-gray-500 mb-4">
                      Your payment has been recorded. You'll be redirected to your dashboard.
                    </p>
                    <Button onClick={() => navigate('/provider')}>
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : application ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Job Application Details</CardTitle>
                      <CardDescription>
                        Payment for accepted application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">{application.jobs.title}</h3>
                          <p className="text-gray-500">{application.jobs.company}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Applicant</p>
                          <p>{application.profiles.first_name} {application.profiles.last_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Status</p>
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {application.status}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Applied On</p>
                          <p>{new Date(application.applied_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <ManualPaymentForm
                    moonlighterId={application.moonlighter_id}
                    jobId={application.job_id}
                    applicationId={application.id}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
                
                <div>
                  <MoonlighterPaymentMethods moonlighterId={application.moonlighter_id} />
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-500">
                    Application not found or you don't have permission to access it.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default MakePaymentPage;
