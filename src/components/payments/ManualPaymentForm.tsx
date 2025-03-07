
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PaymentMethod, ManualPayment } from '@/types/payment';
import { recordManualPayment } from '@/services/manualPaymentService';

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId?: string;
  applicationId?: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
}

interface FormValues {
  paymentMethodId: string;
  paymentMethodType: 'gcash' | 'paymaya' | 'bank';
  paymentDetails: string;
  referenceNumber: string;
  notes: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      paymentMethodId: paymentMethods[0]?.id || '',
      paymentMethodType: paymentMethods[0]?.method || 'gcash',
      paymentDetails: '',
      referenceNumber: '',
      notes: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate the payment method type
      const paymentMethodType = values.paymentMethodType;
      const validTypes = ['gcash', 'paymaya', 'bank'] as const;
      
      // Ensure it's one of the valid types
      const validPaymentMethodType = validTypes.includes(paymentMethodType as any) 
        ? paymentMethodType 
        : 'gcash';
      
      const paymentData: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at'> = {
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount: amount,
        payment_method_id: values.paymentMethodId,
        payment_method_type: validPaymentMethodType,
        payment_details: values.paymentDetails,
        reference_number: values.referenceNumber,
        notes: values.notes,
        status: 'completed'
      };

      await recordManualPayment(paymentData);
      
      toast.success('Payment recorded successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Manual Payment</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Amount to Pay:</div>
              <div className="font-bold text-lg">₱{amount.toFixed(2)}</div>
            </div>
            
            <FormField
              control={form.control}
              name="paymentMethodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
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
                      placeholder="Enter payment details (account number, recipient name, etc.)" 
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
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter transaction reference number" 
                      {...field} 
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
                      placeholder="Add any additional notes about this payment" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Payment...' : 'Record Payment'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ManualPaymentForm;
