
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentMethod } from '@/types/payment';
import { deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';
import { Bank, CreditCard, Trash2 } from 'lucide-react';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  userId: string;
  onUpdate: () => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ paymentMethods, userId, onUpdate }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSetDefault = async (methodId: string) => {
    setIsLoading(`default-${methodId}`);
    try {
      const success = await setDefaultPaymentMethod(userId, methodId);
      if (success) {
        toast.success('Default payment method updated');
        onUpdate();
      } else {
        toast.error('Failed to update default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }
    
    setIsLoading(`delete-${methodId}`);
    try {
      const success = await deletePaymentMethod(userId, methodId);
      if (success) {
        toast.success('Payment method deleted');
        onUpdate();
      } else {
        toast.error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'bank':
        return <Bank className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No payment methods added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id} className={`${method.is_default ? 'border-primary' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {getMethodIcon(method.method)}
              {method.method === 'gcash' ? 'GCash' : 
               method.method === 'paymaya' ? 'PayMaya' : 
               'Bank Transfer'}
              {method.is_default && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 ml-2">
                  Default
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{method.details}</p>
            <div className="flex items-center justify-end mt-4 space-x-2">
              {!method.is_default && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                  disabled={isLoading === `default-${method.id}`}
                >
                  {isLoading === `default-${method.id}` ? 'Setting...' : 'Set as Default'}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDelete(method.id)}
                disabled={isLoading === `delete-${method.id}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
