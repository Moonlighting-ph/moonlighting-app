import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash } from 'lucide-react';

export interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onMethodsChanged: () => Promise<void>;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods, onMethodsChanged }) => {
  const handleDelete = async (methodId: string) => {
    // Call the delete function and refresh the methods list
    await deletePaymentMethod(methodId);
    await onMethodsChanged();
  };

  return (
    <div className="space-y-4">
      {methods.map(method => (
        <Card key={method.id}>
          <CardHeader>
            <CardTitle>{method.method}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <Badge variant={method.is_default ? 'outline' : 'default'}>
                {method.is_default ? 'Default' : 'Standard'}
              </Badge>
            </div>
            <Button variant="destructive" onClick={() => handleDelete(method.id)}>
              <Trash className="mr-2" /> Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
