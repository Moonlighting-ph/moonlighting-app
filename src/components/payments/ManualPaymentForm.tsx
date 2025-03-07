
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { recordManualPayment } from '@/services/manualPaymentService';
import { toast } from 'sonner';
import { ManualPaymentFormProps, PaymentMethodType } from '@/types/payment';

interface FormValues {
  amount: number;
  paymentMethodType: PaymentMethodType;
  paymentDetails: string;
  referenceNumber?: string;
  notes?: string;
}

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  paymentMethods,
  onComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      paymentMethodType: 'bank_transfer',
      paymentDetails: '',
      referenceNumber: '',
      notes: ''
    }
  });
  
  const handleSubmit = async (values: FormValues) => {
    if (values.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await recordManualPayment({
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount: values.amount,
        payment_method_type: values.paymentMethodType,
        payment_details: values.paymentDetails,
        reference_number: values.referenceNumber || undefined,
        notes: values.notes || undefined
      });
      
      toast.success('Payment recorded successfully');
      form.reset();
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast.error(error.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          rules={{ 
            required: 'Amount is required',
            min: { value: 1, message: 'Amount must be greater than 0' }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (PHP)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter amount"
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentMethodType"
          rules={{ required: 'Payment method is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="paymaya">PayMaya</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentDetails"
          rules={{ required: 'Payment details are required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Details</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter payment details"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Number (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter reference number"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter additional notes"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Recording Payment...' : 'Record Payment'}
        </Button>
      </form>
    </Form>
  );
};

export default ManualPaymentForm;
