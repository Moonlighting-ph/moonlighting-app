
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentMethod } from '@/types/payment';
import { getUserPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CreditCard, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

// Define the props interface for the component
interface PaymentMethodsListProps {
  refreshTrigger: number;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ refreshTrigger }) => {
  const { session } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const methods = await getUserPaymentMethods(session.user.id);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [session, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deletePaymentMethod(id);
      setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== id));
      toast('Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast('Failed to delete payment method');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setSettingDefaultId(id);
      await setDefaultPaymentMethod(id);
      
      // Update local state to reflect the change
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({
          ...method,
          is_default: method.id === id
        }))
      );
      
      toast('Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast('Failed to update default payment method');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
      case 'paymaya':
        return <CreditCard className="h-5 w-5" />;
      case 'bank':
        return <Building className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            You haven't added any payment methods yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Payment Methods</h3>
      {paymentMethods.map((method) => (
        <Card key={method.id} className={method.is_default ? 'border-primary' : ''}>
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            {!method.is_default && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSetDefault(method.id)}
                disabled={settingDefaultId === method.id}
              >
                {settingDefaultId === method.id ? 'Setting...' : 'Set as Default'} 
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDelete(method.id)}
              disabled={deletingId === method.id}
            >
              {deletingId === method.id ? 'Deleting...' : 'Delete'} 
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
