
import React, { useEffect, useState } from 'react';
import { fetchUserPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, CreditCard, Star, StarIcon } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodsListProps {
  userId?: string;
  onItemClick?: (method: PaymentMethod) => void;
  refreshTrigger?: number;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ 
  userId, 
  onItemClick,
  refreshTrigger = 0
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      setLoading(true);
      const data = await fetchUserPaymentMethods(userId);
      setMethods(data);
      setLoading(false);
    };

    loadPaymentMethods();
  }, [userId, refreshTrigger]);

  const handleDelete = async (id: string) => {
    const success = await deletePaymentMethod(id);
    if (success) {
      setMethods(methods.filter(method => method.id !== id));
    }
  };

  const handleSetDefault = async (id: string) => {
    const success = await setDefaultPaymentMethod(id);
    if (success) {
      setMethods(methods.map(method => ({
        ...method,
        is_default: method.id === id
      })));
    }
  };

  const getMethodIcon = (method: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  const formatMethodDetails = (method: PaymentMethod) => {
    return method.details;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-6">
          <p className="text-center text-gray-500">No payment methods found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Payment Methods</CardTitle>
        <CardDescription>
          Payment methods that will be visible to healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {methods.map((method) => (
            <div 
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                method.is_default ? 'border-primary/50 bg-primary/5' : 'border-border'
              } ${onItemClick ? 'cursor-pointer hover:bg-accent' : ''}`}
              onClick={() => onItemClick && onItemClick(method)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${method.is_default ? 'bg-primary/20' : 'bg-secondary'}`}>
                  {getMethodIcon(method.method)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium capitalize">{method.method}</h4>
                    {method.is_default && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        <StarIcon className="h-3 w-3 mr-1 fill-primary" /> Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatMethodDetails(method)}</p>
                </div>
              </div>

              {!onItemClick && (
                <div className="flex space-x-2">
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(method.id);
                      }}
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(method.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this payment method.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => {
                            if (deleteId) handleDelete(deleteId);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsList;
