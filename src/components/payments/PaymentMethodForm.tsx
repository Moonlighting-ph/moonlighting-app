
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaymentMethodFormProps, PaymentMethodType } from '@/types/payment';
import { addPaymentMethod } from '@/services/paymentMethodService';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type FormValues = {
  method: PaymentMethodType;
  details: string;
  makeDefault: boolean;
};

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      method: 'bank_transfer',
      details: '',
      makeDefault: false
    }
  });
  
  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      await addPaymentMethod(
        userId,
        values.method,
        values.details,
        values.makeDefault
      );
      
      await onComplete();
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast.error(error.message || 'Failed to add payment method');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedMethod = form.watch('method');
  
  const getMethodLabel = () => {
    switch (selectedMethod) {
      case 'bank_transfer':
        return 'Bank Account Details';
      case 'gcash':
        return 'GCash Number';
      case 'paymaya':
        return 'PayMaya Account';
      case 'credit_card':
        return 'Card Information';
      case 'cash':
        return 'Additional Information';
      default:
        return 'Details';
    }
  };
  
  const getMethodPlaceholder = () => {
    switch (selectedMethod) {
      case 'bank_transfer':
        return 'Bank name, account number, account name';
      case 'gcash':
        return 'GCash mobile number (e.g. 09123456789)';
      case 'paymaya':
        return 'PayMaya mobile number or account name';
      case 'credit_card':
        return 'Card number, name on card';
      case 'cash':
        return 'Preferred location, contact information, etc.';
      default:
        return 'Enter details';
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="method"
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
          name="details"
          rules={{ required: 'Payment details are required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getMethodLabel()}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={getMethodPlaceholder()}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="makeDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Set as default payment method
                </FormLabel>
              </div>
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
