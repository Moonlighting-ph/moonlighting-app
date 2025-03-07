
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import StripePaymentForm from '@/components/StripePaymentForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { toast } from 'sonner';

const MakePaymentPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId, applicationId } = useParams();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the moonlighter ID from the location state
  const moonlighterId = location.state?.moonlighterId || '';
  const amount = location.state?.amount || 0;
  const jobTitle = location.state?.jobTitle || 'Job';

  useEffect(() => {
    if (!session?.user?.id) {
      navigate('/auth/login');
      return;
    }

    if (!moonlighterId || !jobId || !applicationId) {
      toast.error('Missing payment information');
      navigate('/provider/applications');
      return;
    }

    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        // Get the moonlighter's payment methods
        const methods = await fetchPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [session, navigate, moonlighterId, jobId, applicationId]);

  const handlePaymentComplete = () => {
    toast.success('Payment recorded successfully');
    navigate('/provider/applications');
  };

  if (!session || !moonlighterId || !jobId || !applicationId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Make Payment for {jobTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="manual">Manual Payment</TabsTrigger>
                  <TabsTrigger value="stripe" disabled>Stripe Payment (Coming Soon)</TabsTrigger>
                </TabsList>

                <TabsContent value="manual">
                  {!loading && paymentMethods.length > 0 ? (
                    <ManualPaymentForm
                      providerId={session.user.id}
                      moonlighterId={moonlighterId}
                      jobId={jobId!}
                      applicationId={applicationId!}
                      paymentMethods={paymentMethods}
                      onComplete={handlePaymentComplete}
                    />
                  ) : (
                    <p className="text-gray-500">
                      {loading 
                        ? 'Loading payment methods...' 
                        : 'No payment methods available for this moonlighter. They need to add payment methods first.'}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="stripe">
                  <StripePaymentForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MakePaymentPage;
