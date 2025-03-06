
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Banknote, Building } from 'lucide-react';
import { toast } from 'sonner';
import { recordManualPayment } from '@/services/manualPaymentService';
import { PaymentMethod } from '@/types/payment';

interface ManualPaymentFormProps {
  applicationId: string;
  jobId: string;
  providerId: string;
  moonlighterId: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  paymentMethodId: z.string().optional(),
  paymentMethodType: z.string(),
  paymentDetails: z.string().min(5, "Payment details required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  applicationId,
  jobId,
  providerId,
  moonlighterId,
  amount,
  paymentMethods,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethodType: paymentMethods?.length > 0 ? paymentMethods[0].method : 'gcash',
      paymentDetails: paymentMethods?.length > 0 ? paymentMethods[0].details : '',
      referenceNumber: '',
      notes: '',
    },
  });

  const handlePaymentMethodChange = (value: string) => {
    const selectedMethod = paymentMethods.find(method => method.id === value);
    if (selectedMethod) {
      form.setValue('paymentMethodType', selectedMethod.method);
      form.setValue('paymentDetails', selectedMethod.details);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await recordManualPayment({
        applicationId,
        jobId,
        providerId,
        moonlighterId,
        amount,
        paymentMethodId: data.paymentMethodId,
        paymentMethodType: data.paymentMethodType,
        paymentDetails: data.paymentDetails,
        referenceNumber: data.referenceNumber,
        notes: data.notes,
      });
      
      toast.success('Payment recorded successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon based on payment method type
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'gcash':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-gray-500" />;
      default:
        return <Banknote className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manual Payment</CardTitle>
        <CardDescription>Record payment for the moonlighter</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 mb-4 bg-gray-50">
              <p className="text-sm font-medium mb-1">Payment amount</p>
              <p className="text-2xl font-bold">₱{amount.toFixed(2)}</p>
            </div>
            
            {paymentMethods && paymentMethods.length > 0 ? (
              <>
                <FormField
                  control={form.control}
                  name="paymentMethodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Payment Method</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePaymentMethodChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center gap-2">
                                {getPaymentIcon(method.method)}
                                <span className="capitalize">{method.method}</span> - {method.details}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="paymentMethodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                        <Input
                          placeholder="Enter account number or payment details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter reference number"
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
                      placeholder="Add any additional notes about the payment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Recording payment...' : 'Confirm Payment'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ManualPaymentForm;
