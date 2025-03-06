
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  jobTitle: string;
  payeeName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency,
  jobTitle,
  payeeName,
  onSuccess,
  onCancel
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would process the Stripe payment
    // For this demo, we'll simulate success
    toast('Payment processed successfully', {
      description: 'This is a simulated payment confirmation'
    });
    
    onSuccess();
  };

  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency || 'PHP',
  }).format(amount);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Make payment for {jobTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Amount</p>
            <p className="text-2xl font-bold">{formattedAmount}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Payment to</p>
            <p className="text-base">{payeeName}</p>
          </div>
          
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-center text-sm text-gray-500">
              This is a simulated payment form. In a real implementation, this would include Stripe Elements for card input.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Process Payment</Button>
      </CardFooter>
    </Card>
  );
};

export default StripePaymentForm;
