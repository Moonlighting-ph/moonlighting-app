
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';

interface PaymentMethodFormProps {
  userId: string;
  onComplete: () => void;
}

const formSchema = z.object({
  method: z.string().min(1, 'Payment method is required'),
  details: z.string().min(3, 'Details are required'),
  is_default: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: '',
      details: '',
      is_default: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await createPaymentMethod({
        user_id: userId,
        method: values.method,
        details: values.details,
        is_default: values.is_default || false,
      });
      
      toast.success('Payment method added successfully');
      form.reset();
      onComplete();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="method"
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
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="GCash">GCash</SelectItem>
                  <SelectItem value="PayMaya">PayMaya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Details</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Account number, name, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  id="is_default"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel htmlFor="is_default" className="cursor-pointer font-normal">
                Set as default payment method
              </FormLabel>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentMethodForm;
