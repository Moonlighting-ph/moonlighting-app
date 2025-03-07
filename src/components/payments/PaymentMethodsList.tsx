
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Smartphone, CreditCard, Building } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';
import { fetchUserPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PaymentMethodsListProps {
  userId: string;
  refreshTrigger?: number;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ userId, refreshTrigger = 0 }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const methods = await fetchUserPaymentMethods(userId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, [userId, refreshTrigger]);
  
  const handleDelete = async (id: string) => {
    try {
      await deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast.success('Payment method deleted');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setDeleteId(null);
    }
  };
  
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(userId, id);
      
      // Update the local state to reflect the change
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          is_default: method.id === id
        }))
      );
      
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    }
  };
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-green-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading payment methods...</div>;
  }
  
  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Payment Methods</CardTitle>
          <CardDescription>
            You haven't added any payment methods yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Add a payment method to receive payments for your services.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {paymentMethods.map(method => (
        <Card key={method.id} className={method.is_default ? 'border-primary' : ''}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center">
              {getMethodIcon(method.method)}
              <div className="ml-3">
                <CardTitle className="text-base capitalize">
                  {method.method}
                  {method.is_default && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{method.details}</CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setDeleteId(method.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </CardHeader>
          <CardContent>
            {!method.is_default && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSetDefault(method.id)}
                className="mt-2"
              >
                Set as Default
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment method. You won't be able to use it for future payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentMethodsList;
