
import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { CreditCard, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  userId: string;
  onUpdate: () => Promise<void>;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods, userId, onUpdate }) => {
  const deletePaymentMethod = async (id: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to delete payment method');
      
      await onUpdate();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  if (!methods || methods.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No payment methods found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {methods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>{method.method}</span>
              {method.is_default && <Badge variant="outline">Default</Badge>}
            </CardTitle>
            <CardDescription>{formatMethodDetails(method.method, method.details)}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              Added on {new Date(method.created_at || '').toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="bg-muted/20 p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deletePaymentMethod(method.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

// Helper function to format the payment method details
const formatMethodDetails = (method: string, details: string): string => {
  try {
    const detailsObj = JSON.parse(details);
    switch (method.toLowerCase()) {
      case 'bank':
        return `${detailsObj.bank_name} - ${mask(detailsObj.account_number)}`;
      case 'gcash':
        return mask(detailsObj.phone_number);
      case 'paymaya':
        return mask(detailsObj.phone_number);
      case 'card':
        return `${detailsObj.brand} - ${mask(detailsObj.last4, 4, '*')}`;
      default:
        return details;
    }
  } catch (e) {
    return details;
  }
};

// Mask a string showing only the last 4 characters
const mask = (value: string, visible = 4, char = '•') => {
  if (!value) return '';
  if (value.length <= visible) return value;
  
  const visiblePart = value.slice(-visible);
  const maskedPart = char.repeat(value.length - visible);
  return `${maskedPart}${visiblePart}`;
};

export default PaymentMethodsList;
