import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { PaymentMethod } from '@/types/payment';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import StripePaymentForm from '@/components/StripePaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MakePaymentPage: React.FC = () => {
  const { session } = useAuth();
  const providerId = session?.user?.id || '';
  const moonlighterId = 'mock-moonlighter-id';  // Would typically come from URL or context
  const jobId = 'mock-job-id';                 // Would typically come from URL or context
  const applicationId = 'mock-application-id'; // Would typically come from URL or context
  
  // Mock data for illustration
  const mockPaymentMethods: PaymentMethod[] = [];
  
  const amount = 1000;
  const currency = 'PHP';
  const jobTitle = 'Sample Job';
  const payeeName = 'Sample Moonlighter';

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful!', paymentIntent);
    // Implement success handling
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed!', error);
    // Implement error handling
  };
  
  const handlePaymentComplete = () => {
    // Redirect or update UI after payment completion
  };

  return (
    <Container>
      <Heading>Make Payment</Heading>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Payment</TabsTrigger>
              <TabsTrigger value="stripe">Stripe Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <ManualPaymentForm
                providerId={providerId}
                moonlighterId={moonlighterId}
                jobId={jobId}
                applicationId={applicationId}
                paymentMethods={mockPaymentMethods}
                onSuccess={() => {}}
                onCancel={() => {}}
                onComplete={handlePaymentComplete}
              />
            </TabsContent>
            
            <TabsContent value="stripe">
              <StripePaymentForm
                amount={amount}
                currency={currency}
                jobTitle={jobTitle}
                payeeName={payeeName}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MakePaymentPage;
