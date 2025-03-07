import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod, StripePaymentFormProps } from '@/types/payment';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import StripePaymentForm from '@/components/StripePaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MakePayment: React.FC = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const providerId = session?.user?.id;
  
  const { state } = location;
  const { jobTitle, companyName, moonlighterId, jobId, applicationId, paymentAmount } = 
    state || {};
  
  useEffect(() => {
    if (!session?.user) {
      navigate('/auth/login');
      return;
    }
    
    if (!state || !moonlighterId || !jobId || !applicationId) {
      toast.error('Missing required payment information');
      navigate('/provider');
      return;
    }
    
    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await fetchPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Unable to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, [session, navigate, state, moonlighterId]);
  
  const handlePaymentComplete = () => {
    toast.success('Payment has been sent');
    navigate('/provider/applications');
  };
  
  if (loading || !providerId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading payment information...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Prepare data for Stripe payment form
  const stripeProps: StripePaymentFormProps = {
    amount: paymentAmount || 0,
    currency: 'PHP',
    jobTitle: jobTitle || '',
    payeeName: companyName || '',
    applicationId,
    providerId,
    moonlighterId
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/provider/applications')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Make a Payment</h1>
          <p className="text-muted-foreground mt-1">
            Send payment to healthcare professional for completed work
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Review details before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Job:</span>
                <span className="font-medium">{jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span>{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">₱ {paymentAmount?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="manual">
          <TabsList className="mb-6">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Manual Payment
            </TabsTrigger>
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Stripe Payment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-6">
            <ManualPaymentForm
              providerId={providerId}
              moonlighterId={moonlighterId}
              jobId={jobId}
              applicationId={applicationId}
              paymentMethods={paymentMethods}
              onComplete={handlePaymentComplete}
            />
          </TabsContent>
          
          <TabsContent value="stripe">
            <StripePaymentForm {...stripeProps} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MakePayment;
