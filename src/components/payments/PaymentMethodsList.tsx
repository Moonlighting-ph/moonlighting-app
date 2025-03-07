
import React from 'react';
import { Payment } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { deletePaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { toast } from 'sonner';

export interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  userId: string;
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ 
  paymentMethods, 
  userId,
  onRefresh
}) => {
  const handleDelete = async (methodId: string) => {
    try {
      await deletePaymentMethod(methodId, userId);
      toast.success('Payment method removed successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to remove payment method');
    }
  };

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Payment Methods</CardTitle>
          <CardDescription>You haven't added any payment methods yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Payment Methods</CardTitle>
        <CardDescription>Manage your saved payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Payment className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{method.method}</p>
                  <p className="text-sm text-gray-500">{method.details}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(method.id)}
              >
                Remove
              </Button>
            </div>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsList;
