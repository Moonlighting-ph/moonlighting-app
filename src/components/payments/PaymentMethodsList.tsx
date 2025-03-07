
import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon, CreditCard, Trash2, Plus, Wallet, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onAddNew: () => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  onDelete,
  onSetDefault,
  onAddNew
}) => {
  // Helper to safely access nested properties
  const getDetailsValue = (details: any, key: string): string => {
    if (!details) return '';
    if (typeof details === 'string') return '';
    return details[key] || '';
  };

  const formatMethodDetails = (method: PaymentMethod) => {
    const { method: methodType, details } = method;
    
    switch (methodType.toLowerCase()) {
      case 'bank':
        return (
          <div className="space-y-1">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                {getDetailsValue(details, 'bank_name')} - {getDetailsValue(details, 'account_name')}
              </span>
            </div>
            {getDetailsValue(details, 'account_number') && (
              <div className="text-sm text-muted-foreground ml-6">
                Account: •••• {getDetailsValue(details, 'account_number').slice(-4)}
              </div>
            )}
          </div>
        );
      
      case 'gcash':
      case 'paymaya':
        return (
          <div className="space-y-1">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                {methodType === 'gcash' ? 'GCash' : 'PayMaya'} 
              </span>
            </div>
            {getDetailsValue(details, 'phone') && (
              <div className="text-sm text-muted-foreground ml-6">
                Phone: {getDetailsValue(details, 'phone')}
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{methodType}</span>
          </div>
        );
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground mb-6">
              Add a payment method to receive payments from healthcare providers.
            </p>
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">
                {method.method.charAt(0).toUpperCase() + method.method.slice(1)} Payment
                {method.is_default && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                    <StarIcon className="h-3 w-3 mr-1 fill-amber-500" />
                    Default
                  </Badge>
                )}
              </CardTitle>
              <div className="flex space-x-2">
                {!method.is_default && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSetDefault(method.id)}
                    className="h-8 text-xs"
                  >
                    Set as Default
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(method.id)}
                  className="h-8 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {formatMethodDetails(method)}
            <p className="text-xs text-muted-foreground mt-2">
              Added: {new Date(method.created_at || '').toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="outline" onClick={onAddNew} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Another Payment Method
      </Button>
    </div>
  );
};

export default PaymentMethodsList;
