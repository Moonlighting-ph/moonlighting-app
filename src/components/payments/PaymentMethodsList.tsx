
import React, { useState } from 'react';
import { PaymentMethod } from '@/types/payment';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  CreditCard,
  Wallet,
  Bank,
  DollarSign,
} from 'lucide-react';

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  userId: string;
  onUpdate: () => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  methods,
  userId,
  onUpdate,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleDelete = async () => {
    if (!methodToDelete) return;
    
    try {
      setIsProcessing(true);
      await deletePaymentMethod(methodToDelete.id, userId);
      toast.success('Payment method deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setIsProcessing(false);
      setDeleteConfirmOpen(false);
      setMethodToDelete(null);
    }
  };
  
  const handleSetDefault = async (methodId: string) => {
    try {
      setIsProcessing(true);
      await setDefaultPaymentMethod(methodId, userId);
      toast.success('Default payment method updated');
      onUpdate();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'gcash':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'bank':
        return <Bank className="h-5 w-5 text-gray-700" />;
      case 'cash':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (methods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No payment methods added yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="mr-4">
                {getMethodIcon(method.method)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="font-medium capitalize">{method.method}</h3>
                  {method.is_default && (
                    <Badge variant="outline" className="ml-2">Default</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{method.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Added on {formatDate(method.created_at)}
                </p>
              </div>
              <div className="flex space-x-2">
                {!method.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    disabled={isProcessing}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setMethodToDelete(method);
                    setDeleteConfirmOpen(true);
                  }}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentMethodsList;
