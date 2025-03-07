
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/types/payment';
import { recordManualPayment } from '@/services/manualPaymentService';
import { toast } from 'sonner';

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  paymentMethods: PaymentMethod[];
  onComplete?: () => void;
}

const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  paymentMethodId: z.string().min(1, "Payment method is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  notes: z.string().optional(),
  paymentDetails: z.string().min(1, "Payment details are required"),
});

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  providerId,
  moonlighterId,
  jobId,
  applicationId,
  paymentMethods,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethodId: '',
      referenceNumber: '',
      notes: '',
      paymentDetails: '',
    },
  });
  
  // Watch for changes to paymentMethodId
  const paymentMethodId = form.watch('paymentMethodId');
  
  // Update selected payment method when paymentMethodId changes
  React.useEffect(() => {
    if (paymentMethodId && paymentMethods) {
      const method = paymentMethods.find(m => m.id === paymentMethodId);
      setSelectedPaymentMethod(method || null);
    } else {
      setSelectedPaymentMethod(null);
    }
  }, [paymentMethodId, paymentMethods]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      if (!selectedPaymentMethod) {
        toast.error("Please select a valid payment method");
        return;
      }
      
      await recordManualPayment({
        amount: values.amount,
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        payment_method_id: values.paymentMethodId,
        payment_method_type: selectedPaymentMethod.method,
        payment_details: values.paymentDetails,
        reference_number: values.referenceNumber,
        notes: values.notes,
      });
      
      toast.success("Payment recorded successfully");
      form.reset();
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast.error(error.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount (PHP)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Enter amount" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentMethodId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.method.toUpperCase()} - {getPaymentMethodDescription(method)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedPaymentMethod && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="text-sm">
                <p className="font-medium">Payment Method Details:</p>
                <pre className="whitespace-pre-wrap mt-1 font-mono text-xs bg-muted p-2 rounded">
                  {formatPaymentMethodDetails(selectedPaymentMethod)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
        
        <FormField
          control={form.control}
          name="paymentDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Details</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter details about the payment"
                  className="h-20"
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
                <Input {...field} placeholder="Enter payment reference number" />
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
                  placeholder="Add any additional notes about this payment"
                  className="h-20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Recording Payment..." : "Record Payment"}
        </Button>
      </form>
    </Form>
  );
};

// Helper function to get a readable description for the payment method
function getPaymentMethodDescription(method: PaymentMethod): string {
  try {
    const details = JSON.parse(method.details);
    switch (method.method.toLowerCase()) {
      case 'bank':
        return `${details.bank_name} - ${maskString(details.account_number)}`;
      case 'gcash':
      case 'paymaya':
        return maskString(details.phone_number);
      default:
        return method.method;
    }
  } catch (e) {
    return method.method;
  }
}

// Helper function to format payment method details
function formatPaymentMethodDetails(method: PaymentMethod): string {
  try {
    const details = JSON.parse(method.details);
    switch (method.method.toLowerCase()) {
      case 'bank':
        return `Bank: ${details.bank_name}\nAccount Number: ${details.account_number}\nAccount Name: ${details.account_name || 'N/A'}`;
      case 'gcash':
        return `GCash Number: ${details.phone_number}`;
      case 'paymaya':
        return `PayMaya Number: ${details.phone_number}`;
      default:
        return JSON.stringify(details, null, 2);
    }
  } catch (e) {
    return method.details;
  }
}

// Helper function to mask a string
function maskString(str: string, visibleChars = 4): string {
  if (!str) return '';
  if (str.length <= visibleChars) return str;
  
  const visible = str.slice(-visibleChars);
  const masked = '•'.repeat(str.length - visibleChars);
  return `${masked}${visible}`;
}

export default ManualPaymentForm;
