
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { recordManualPayment } from '@/services/manualPaymentService';
import { ManualPayment, PaymentMethod, PaymentMethodType, PaymentStatus } from '@/types/payment';
import { toast } from 'sonner';

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
}

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  amount,
  paymentMethods,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('gcash');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDetails.trim()) {
      toast.error('Please enter payment details');
      return;
    }
    
    if (!referenceNumber.trim()) {
      toast.error('Please enter a reference number');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find the selected payment method if available
      const selectedMethod = paymentMethods.find(m => m.method === paymentMethod);
      
      // Ensure payment_method_type is a valid enum value
      const validMethods = ['gcash', 'paymaya', 'bank'] as const;
      const selectedPaymentMethod = validMethods.includes(paymentMethod as any) 
        ? paymentMethod 
        : 'gcash' as PaymentMethodType;
      
      const paymentData: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at'> = {
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount,
        payment_method_id: selectedMethod?.id || '',
        payment_method_type: selectedPaymentMethod,
        payment_details: paymentDetails,
        reference_number: referenceNumber,
        status: 'completed' as PaymentStatus,
        notes
      };
      
      const result = await recordManualPayment(paymentData);
      
      if (result) {
        toast.success('Payment recorded successfully');
        onSuccess();
      } else {
        toast.error('Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('An error occurred while recording payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={(value) => setPaymentMethod(value as PaymentMethodType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gcash">GCash</SelectItem>
            <SelectItem value="paymaya">PayMaya</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="paymentDetails">Payment Details</Label>
        <Textarea
          id="paymentDetails"
          placeholder="Enter payment details (e.g., transaction details, account used)"
          value={paymentDetails}
          onChange={(e) => setPaymentDetails(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="referenceNumber">Reference Number</Label>
        <Input
          id="referenceNumber"
          placeholder="Enter transaction reference number"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this payment"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Record Payment'}
      </Button>
    </form>
  );
};

export default ManualPaymentForm;
