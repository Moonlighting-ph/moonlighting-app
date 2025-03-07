
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod, PaymentMethodType } from '@/types/payment'; 
import { createPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';

interface PaymentMethodFormProps {
  userId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  method: z.string().min(1, "Payment method is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: '',
      accountNumber: '',
      bankName: '',
      accountName: '',
      phoneNumber: '',
    },
  });
  
  const method = form.watch('method');
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      let details = {};
      const methodType = values.method as PaymentMethodType;
      
      switch (methodType) {
        case 'bank':
          details = {
            bank_name: values.bankName,
            account_number: values.accountNumber,
            account_name: values.accountName,
          };
          break;
        case 'gcash':
        case 'paymaya':
          details = {
            phone_number: values.phoneNumber,
          };
          break;
        default:
          details = {
            account_number: values.accountNumber,
          };
      }
      
      await createPaymentMethod({
        user_id: userId,
        method: methodType,
        details: JSON.stringify(details),
        is_default: false,
      });
      
      toast.success("Payment method added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error("Failed to add payment method");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="method"
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
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="paymaya">PayMaya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {method === 'bank' && (
          <>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="BDO, BPI, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {(method === 'gcash' || method === 'paymaya') && (
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Payment Method"}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentMethodForm;
