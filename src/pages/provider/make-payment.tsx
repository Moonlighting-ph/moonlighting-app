
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SmoothScroll from '../../components/SmoothScroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';
import { fetchUserPaymentMethods } from '@/services/paymentMethodService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payment';

const MakePayment: React.FC = () => {
  const { session } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [moonlighterId, setMoonlighterId] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [applicationId, setApplicationId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!session?.user) {
        navigate('/auth/login');
        return;
      }

      // Get moonlighterId, jobId, and applicationId from URL parameters
      const appId = params.applicationId;
      if (!appId) {
        toast.error('Missing application ID');
        navigate('/provider');
        return;
      }

      try {
        // Fetch application details
        const { data: application, error: appError } = await supabase
          .from('job_applications')
          .select('*, jobs(*)')
          .eq('id', appId)
          .single();

        if (appError || !application) {
          console.error('Error fetching application:', appError);
          toast.error('Failed to load application details');
          navigate('/provider');
          return;
        }

        // Set state from the fetched data
        setApplicationId(application.id);
        setMoonlighterId(application.moonlighter_id);
        setJobId(application.job_id);
        
        // Set amount (you might want to calculate this based on your business logic)
        // For now, let's set a default amount
        setAmount(1000);

        // Fetch moonlighter's payment methods
        if (application.moonlighter_id) {
          const methods = await fetchUserPaymentMethods(application.moonlighter_id);
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while fetching payment details');
        navigate('/provider');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [session, params, navigate]);

  const handleSuccess = () => {
    toast.success('Payment recorded successfully');
    navigate('/provider');
  };

  if (loading) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <p className="text-center">Loading payment details...</p>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Make Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ManualPaymentForm 
                moonlighterId={moonlighterId}
                jobId={jobId}
                applicationId={applicationId}
                providerId={session?.user?.id || ''}
                amount={amount}
                paymentMethods={paymentMethods}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₱{amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  This is the payment amount for the application.
                </p>
              </CardContent>
            </Card>
            
            <MoonlighterPaymentMethods moonlighterId={moonlighterId} />
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default MakePayment;
