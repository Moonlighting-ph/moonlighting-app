
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({ 
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  paymentMethods = [],
  onSuccess,
  onCancel,
  onComplete
}) => {
  const { session } = useAuth();
  const [amount, setAmount] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [methodId, setMethodId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Create a manual payment object with appropriate properties
      const paymentData: Partial<ManualPayment> = {
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount: parseFloat(amount),
        payment_method_id: methodId,
        payment_method_type: selectedMethod.type,
        payment_details: typeof selectedMethod.details === 'string' 
          ? selectedMethod.details 
          : JSON.stringify(selectedMethod.details),
        reference_number: receiptNumber,
        notes: notes
      };
      
      // This is a mock function call for illustration
      // In a real application, this would call an API endpoint
      const mockPayment: ManualPayment = {
        ...paymentData,
        id: 'temp-' + Math.random().toString(36).substring(2, 15),
        status: 'completed',
        created_at: new Date().toISOString(),
        payment_method_type: selectedMethod.type,
      } as ManualPayment;
      
      toast.success('Payment recorded successfully');
      
      if (onSuccess) onSuccess(mockPayment);
      if (onComplete) onComplete();
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
                  {method.type === 'bank_account' && typeof method.details === 'object'
                    ? `${method.details.bank_name || 'Bank'} - ${method.details.account_name || 'Account'}`
                    : method.type === 'gcash' && typeof method.details === 'object'
                    ? `GCash - ${method.details.phone || 'Phone'}`
                    : method.type === 'paymaya' && typeof method.details === 'object'
                    ? `PayMaya - ${method.details.phone || 'Phone'}`
                    : method.type}
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
