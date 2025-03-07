
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';
import { toast } from 'sonner';

interface PaymentMethodFormProps {
  userId: string;
  onSuccess: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethodType>('gcash');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!details.trim()) {
      toast.error('Please enter payment details');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPaymentMethod: Omit<PaymentMethod, 'id' | 'created_at'> = {
        user_id: userId,
        method,
        details,
        is_default: false
      };
      
      const result = await addPaymentMethod(newPaymentMethod);
      
      if (result) {
        toast.success('Payment method added successfully');
        setDetails('');
        setMethod('gcash');
        onSuccess();
      } else {
        toast.error('Failed to add payment method');
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('An error occurred while adding payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="method">Payment Method</Label>
        <Select 
          value={method} 
          onValueChange={(value: PaymentMethodType) => setMethod(value)}
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
        <Label htmlFor="details">
          {method === 'gcash' ? 'GCash Number' : 
           method === 'paymaya' ? 'PayMaya Account' : 
           'Bank Account Details'}
        </Label>
        <Input
          id="details"
          placeholder={method === 'gcash' ? 'Enter GCash number' : 
                       method === 'paymaya' ? 'Enter PayMaya details' : 
                       'Enter bank account details'}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Payment Method'}
      </Button>
    </form>
  );
};

export default PaymentMethodForm;
