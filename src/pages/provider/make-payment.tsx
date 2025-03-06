
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { getUserPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { ManualPaymentForm } from '@/components/payments/ManualPaymentForm';
import { MoonlighterPaymentMethods } from '@/components/payments/MoonlighterPaymentMethods';

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moonlighterPaymentMethods, setMoonlighterPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const applicationId = queryParams.get('applicationId');
  const jobId = queryParams.get('jobId');
  const moonlighterId = queryParams.get('moonlighterId');
  const amount = Number(queryParams.get('amount') || 0);
  const jobTitle = queryParams.get('jobTitle') || 'Job Application';
  
  const providerId = session?.user?.id;

  useEffect(() => {
    // Validate required parameters
    if (!applicationId || !jobId || !moonlighterId || !amount) {
      toast.error('Missing required payment information');
      navigate('/provider');
      return;
    }

    const fetchPaymentMethods = async () => {
      if (!moonlighterId) return;
      
      try {
        setLoading(true);
        const methods = await getUserPaymentMethods(moonlighterId);
        setMoonlighterPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching moonlighter payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [applicationId, jobId, moonlighterId, amount, navigate]);

  const handleSuccess = () => {
    // Navigate back to provider dashboard
    navigate('/provider');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Make Payment</h1>
        <p className="text-muted-foreground mb-6">
          Payment for: {jobTitle}
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Review payment details before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Amount to Pay</span>
                <span className="font-bold">₱{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Transaction Fee</span>
                <span>₱0.00</span>
              </div>
              <div className="flex justify-between py-2 text-lg">
                <span>Total</span>
                <span className="font-bold">₱{amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {moonlighterId && (
          <MoonlighterPaymentMethods moonlighterId={moonlighterId} />
        )}
        
        <div className="mt-8">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Manual Payment
              </TabsTrigger>
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Card
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Record Manual Payment</CardTitle>
                  <CardDescription>
                    Use this form to record a manual payment you've made to the moonlighter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {providerId && moonlighterId && (
                    <ManualPaymentForm
                      providerId={providerId}
                      moonlighterId={moonlighterId}
                      jobId={jobId || ''}
                      applicationId={applicationId || ''}
                      amount={amount}
                      paymentMethods={moonlighterPaymentMethods}
                      onSuccess={handleSuccess}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stripe">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Card Payment</CardTitle>
                  <CardDescription>
                    Pay securely using your credit or debit card
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {providerId && moonlighterId && applicationId && (
                    <StripePaymentForm
                      providerId={providerId}
                      moonlighterId={moonlighterId}
                      applicationId={applicationId}
                      amount={amount}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Add missing toast import
import { toast } from 'sonner';

export default MakePayment;
