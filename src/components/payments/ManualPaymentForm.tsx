
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { recordManualPayment } from '@/services/manualPaymentService';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
}

const formSchema = z.object({
  paymentMethodId: z.string().optional(),
  paymentMethodType: z.string().min(1, "Payment method type is required"),
  paymentDetails: z.string().min(1, "Payment details are required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  amount,
  paymentMethods,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethodType: '',
      paymentDetails: '',
      referenceNumber: '',
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      await recordManualPayment({
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount: amount,
        payment_method_id: values.paymentMethodId || null,
        payment_method_type: values.paymentMethodType,
        payment_details: values.paymentDetails,
        reference_number: values.referenceNumber || null,
        notes: values.notes || null,
      });
      
      toast.success('Payment recorded successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="font-medium">Payment Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">Amount: ₱{amount.toFixed(2)}</p>
        </div>

        {paymentMethods.length > 0 && (
          <FormField
            control={form.control}
            name="paymentMethodId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use Saved Payment Method (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.method.toUpperCase()} - {method.details}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="paymentMethodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="paymaya">PayMaya</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter payment details (account number or transaction details)"
                  className="resize-none"
                  {...field}
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
                <Input placeholder="Enter reference/transaction number" {...field} />
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
                  placeholder="Add any additional notes about this payment"
                  className="resize-none"
                  {...field}
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
