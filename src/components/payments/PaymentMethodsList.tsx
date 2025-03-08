
import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deletePaymentMethod } from '@/services/paymentMethodService';

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onDelete: (id: string) => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods, onDelete }) => {
  const handleDelete = async (id: string) => {
    try {
      await deletePaymentMethod(id);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  if (methods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No payment methods added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <Card key={method.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium capitalize">
                {method.type.replace('_', ' ')}
                {method.is_default && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                    Default
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {method.type === 'bank_account' && typeof method.details === 'object' && method.details.account_number 
                  ? `**** ${method.details.account_number.slice(-4)}` 
                  : method.type === 'gcash' && typeof method.details === 'object' && method.details.phone 
                  ? method.details.phone 
                  : 'Details hidden for security'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(method.id)}
              aria-label="Delete payment method"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
