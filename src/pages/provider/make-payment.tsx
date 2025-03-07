
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import { fetchUserPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { JobApplication } from '@/types/job';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MakePayment: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user || !applicationId) {
        navigate('/provider');
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch the application
        const { data: app, error: appError } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:jobs(*),
            moonlighter:profiles!job_applications_moonlighter_id_fkey(*)
          `)
          .eq('id', applicationId)
          .maybeSingle();
        
        if (appError) {
          throw appError;
        }
        
        if (!app) {
          toast.error('Application not found');
          navigate('/provider/applications');
          return;
        }
        
        setApplication(app as unknown as JobApplication);
        
        // Check if the provider owns this job
        if (app.job.provider_id !== session.user.id) {
          toast.error('You do not have permission to access this application');
          navigate('/provider/applications');
          return;
        }
        
        // Fetch payment methods
        const methods = await fetchUserPaymentMethods(app.moonlighter_id);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load application data');
        navigate('/provider/applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, applicationId, navigate]);
  
  const handlePaymentComplete = () => {
    toast.success('Payment recorded successfully');
    navigate('/provider/applications');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Application not found</p>
            <Button onClick={() => navigate('/provider/applications')}>Back to Applications</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/provider/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
              <CardDescription>
                Record a payment for this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Job</p>
                  <p>{application.job?.title}</p>
                </div>
                
                <div>
                  <p className="font-medium">Moonlighter</p>
                  <p>{application.moonlighter?.first_name} {application.moonlighter?.last_name}</p>
                </div>
                
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant="outline">{application.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {application && session?.user && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Enter the details of the payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManualPaymentForm
                  providerId={session.user.id}
                  moonlighterId={application.moonlighter_id}
                  jobId={application.job_id}
                  applicationId={application.id}
                  paymentMethods={paymentMethods}
                  onComplete={handlePaymentComplete}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MakePayment;
