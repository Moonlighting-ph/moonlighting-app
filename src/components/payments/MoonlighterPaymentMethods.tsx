
import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, CreditCard, Building, Plus } from 'lucide-react';

interface MoonlighterPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddMethod: () => void;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ 
  paymentMethods, 
  onAddMethod 
}) => {
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

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            You haven't added any payment methods yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Add a payment method to receive payments for completed moonlighting jobs.
          </p>
          <Button onClick={onAddMethod}>
            <Plus className="mr-2 h-4 w-4" /> Add Payment Method
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Your preferred payment methods
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onAddMethod}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center p-2 border rounded-md bg-gray-50">
              {getMethodIcon(method.method)}
              <div className="ml-3">
                <h4 className="text-sm font-medium capitalize">{method.method}</h4>
                <p className="text-xs text-gray-500">{method.details}</p>
              </div>
              {method.is_default && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
