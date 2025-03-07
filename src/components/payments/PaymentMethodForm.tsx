
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { addPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';

export interface PaymentMethodFormProps {
  userId: string;
  onComplete?: () => Promise<void>; // Make this prop optional
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onComplete }) => {
  const [method, setMethod] = useState<string>('bank_transfer');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!details.trim()) {
      toast.error('Please provide payment details');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addPaymentMethod({
        userId,
        method,
        details,
        isDefault: false
      });
      
      toast.success('Payment method added successfully');
      setDetails('');
      
      // Call onComplete callback if provided
      if (onComplete) {
        await onComplete();
      }
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast.error(error.message || 'Failed to add payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select
              value={method}
              onValueChange={setMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
                <SelectItem value="paymaya">PayMaya</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">
              {method === 'bank_transfer' ? 'Bank Account Details' : 
               method === 'gcash' ? 'GCash Number' :
               method === 'paymaya' ? 'PayMaya Account' :
               'Payment Details'}
            </Label>
            <Input
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                method === 'bank_transfer' ? 'Bank name, account number, account name' : 
                method === 'gcash' ? 'GCash number' :
                method === 'paymaya' ? 'PayMaya account' :
                'Payment details'
              }
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Payment Method'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodForm;
