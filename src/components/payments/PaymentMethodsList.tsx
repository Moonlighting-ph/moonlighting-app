
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/payment';
import { fetchUserPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';
import { Building, CreditCard, Smartphone, Trash, Star } from 'lucide-react';

export interface PaymentMethodsListProps {
  userId: string;
  onMethodDeleted?: () => void;
  refreshTrigger?: number;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ 
  userId, 
  onMethodDeleted,
  refreshTrigger = 0
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const methods = await fetchUserPaymentMethods(userId);
      setPaymentMethods(methods);
      setError(null);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to load payment methods');
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMethods();
    }
  }, [userId, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await deletePaymentMethod(id, userId);
      toast.success('Payment method deleted');
      fetchMethods();
      if (onMethodDeleted) {
        onMethodDeleted();
      }
    } catch (err) {
      console.error('Error deleting payment method:', err);
      toast.error('Failed to delete payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id, userId);
      toast.success('Default payment method updated');
      fetchMethods();
    } catch (err) {
      console.error('Error setting default payment method:', err);
      toast.error('Failed to update default payment method');
    }
  };

  if (loading && paymentMethods.length === 0) {
    return <div className="py-4 text-center">Loading payment methods...</div>;
  }

  if (error && paymentMethods.length === 0) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  if (paymentMethods.length === 0) {
    return <div className="py-4 text-center">No payment methods added yet.</div>;
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-green-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Payment Methods</h3>
      {paymentMethods.map((method) => (
        <Card key={method.id} className={`overflow-hidden ${method.is_default ? 'border-primary' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center">
            <CardHeader className="py-3">
              <div className="flex items-center space-x-3">
                {getMethodIcon(method.method)}
                <div>
                  <CardTitle className="text-base">
                    {method.method.charAt(0).toUpperCase() + method.method.slice(1)}
                    {method.is_default && (
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">{method.details}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-row ml-auto py-3 space-x-2">
              {!method.is_default && (
                <Button 
                  onClick={() => handleSetDefault(method.id)} 
                  size="sm" 
                  variant="outline"
                  title="Set as default"
                >
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Set as default</span>
                </Button>
              )}
              <Button 
                onClick={() => handleDelete(method.id)} 
                size="sm" 
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                title="Delete payment method"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
