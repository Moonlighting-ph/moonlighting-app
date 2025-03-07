
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';
import { PaymentMethodType } from '@/types/payment';

export interface PaymentMethodFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel?: () => void; // Make onCancel optional
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onSuccess, onCancel }) => {
  const [activeTab, setActiveTab] = useState<PaymentMethodType>('gcash');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!details.trim()) {
      toast.error('Please enter your account details');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPaymentMethod({
        user_id: userId,
        method: activeTab,
        details: details,
        is_default: true
      });
      
      toast.success(`${activeTab.toUpperCase()} payment method added successfully`);
      setDetails('');
      onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PaymentMethodType)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="gcash">GCash</TabsTrigger>
              <TabsTrigger value="paymaya">PayMaya</TabsTrigger>
              <TabsTrigger value="bank">Bank</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gcash">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gcash-number">GCash Number</Label>
                  <Input 
                    id="gcash-number" 
                    placeholder="09xxxxxxxxx"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="paymaya">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymaya-number">PayMaya Number</Label>
                  <Input 
                    id="paymaya-number" 
                    placeholder="09xxxxxxxxx or email"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bank">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-details">Bank Account Details</Label>
                  <Input 
                    id="bank-details" 
                    placeholder="Bank name, account number, account name"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Payment Method'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentMethodForm;
