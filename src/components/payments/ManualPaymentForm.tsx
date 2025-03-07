
import React, { useState } from 'react';
import { createManualPayment } from '@/services/manualPaymentService';
import { PaymentMethod, ManualPaymentFormProps } from '@/types/payment';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  paymentMethodId: z.string({
    required_error: 'Please select a payment method'
  }),
  amount: z.string().min(1, 'Amount is required'),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  notes: z.string().optional(),
});

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  paymentMethods,
  onComplete
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethodId: '',
      amount: '',
      referenceNumber: '',
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const paymentData = {
        payment_method_id: values.paymentMethodId,
        amount: parseFloat(values.amount),
        reference_number: values.referenceNumber,
        notes: values.notes || null,
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId
      };
      
      await createManualPayment(paymentData);
      toast.success('Payment recorded successfully');
      
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Error creating manual payment:', err);
      setError('Failed to create payment. Please try again.');
      toast.error('Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to safely access nested properties
  const getDetailsValue = (details: any, key: string): string => {
    if (!details) return '';
    if (typeof details === 'string') return '';
    return details[key] || '';
  };

  const formatPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method.method.toLowerCase()) {
      case 'bank':
        return `${getDetailsValue(method.details, 'bank_name')} - ${getDetailsValue(method.details, 'account_name')}`;
      case 'gcash':
      case 'paymaya':
        return `${method.method} (${getDetailsValue(method.details, 'phone')})`;
      default:
        return method.method;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {paymentMethods.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Payment Methods</AlertTitle>
          <AlertDescription>
            The healthcare professional hasn't added any payment methods yet. 
            Ask them to add a payment method before proceeding.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    disabled={submitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {formatPaymentMethodLabel(method)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (PHP)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={submitting}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
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
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={submitting}
                      placeholder="Transaction reference or confirmation number"
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
                      disabled={submitting}
                      placeholder="Any additional payment details"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? 'Processing...' : 'Record Payment'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ManualPaymentForm;
