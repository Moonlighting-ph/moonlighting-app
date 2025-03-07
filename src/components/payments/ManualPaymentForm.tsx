
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createManualPayment } from '@/services/manualPaymentService';
import { 
  PaymentMethod, 
  PaymentMethodType, 
  ManualPayment,
  ManualPaymentFormProps
} from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({ onSuccess, onCancel }) => {
  const { session } = useAuth();
  const [amount, setAmount] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [methodId, setMethodId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // These would be passed as props in a real implementation
  const providerId = ''; // Example value
  const moonlighterId = ''; // Example value
  const jobId = ''; // Example value
  const applicationId = ''; // Example value
  const paymentMethods: PaymentMethod[] = []; // Example value

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a payment');
      return;
    }

    if (!amount || !receiptNumber || !methodId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Find the selected payment method
      const selectedMethod = paymentMethods.find(m => m.id === methodId);
      if (!selectedMethod) {
        toast.error('Invalid payment method selected');
        return;
      }

      const paymentData = {
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount: parseFloat(amount),
        currency: 'PHP',
        payment_method_id: methodId,
        payment_method_type: selectedMethod.type,
        receipt_number: receiptNumber,
        notes: notes,
        payment_details: JSON.stringify(selectedMethod.details)
      };
      
      const payment = await createManualPayment(paymentData);
      
      toast.success('Payment recorded successfully');
      onSuccess(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (PHP)</Label>
          <Input 
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="1"
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select value={methodId} onValueChange={setMethodId} required>
            <SelectTrigger id="payment_method">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.type === 'bank_account' 
                    ? `${method.details.bank_name} - ${method.details.account_name}`
                    : method.type === 'gcash' 
                    ? `GCash - ${method.details.phone}`
                    : method.type === 'paymaya'
                    ? `PayMaya - ${method.details.phone}`
                    : 'Other'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receipt_number">Receipt/Reference Number</Label>
          <Input 
            id="receipt_number"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            placeholder="e.g., 123456789"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea 
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional payment details"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
};

export default ManualPaymentForm;
