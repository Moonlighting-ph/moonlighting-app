
import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { Banknote, Card as CardIcon, CreditCard, Building, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MoonlighterPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  showAddButton?: boolean;
  onSelectMethod?: (method: PaymentMethod) => void;
  selectedMethodId?: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({
  paymentMethods,
  showAddButton = true,
  onSelectMethod,
  selectedMethodId
}) => {
  const navigate = useNavigate();
  
  const handleAddMethod = () => {
    navigate('/moonlighter/payment-methods');
  };

  // Get icon based on payment method type
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'gcash':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'paymaya':
        return <CardIcon className="h-5 w-5 text-purple-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-gray-500" />;
      default:
        return <Banknote className="h-5 w-5 text-green-500" />;
    }
  };

  // Format account details for display
  const formatAccountDetails = (details: string, type: string) => {
    if (type === 'bank') {
      // Simple formatting for bank account numbers (if needed)
      return details;
    } else if (details.length > 4) {
      // Format phone numbers for GCash/PayMaya with last 4 digits visible
      return `•••• •••• ${details.slice(-4)}`;
    }
    return details;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        {showAddButton && (
          <Button variant="outline" size="sm" onClick={handleAddMethod}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        )}
      </div>
      
      {paymentMethods.length === 0 ? (
        <div className="text-center py-6 border rounded-md bg-gray-50">
          <p className="text-gray-500">No payment methods added</p>
          {showAddButton && (
            <Button variant="link" onClick={handleAddMethod}>
              Add a payment method
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <Card 
              key={method.id}
              className={cn(
                "cursor-pointer hover:border-primary transition-colors",
                selectedMethodId === method.id && "border-primary bg-primary/5"
              )}
              onClick={() => onSelectMethod && onSelectMethod(method)}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0 gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getPaymentIcon(method.method)}
                </div>
                <div>
                  <p className="font-medium capitalize">{method.method}</p>
                  {method.is_default && <span className="text-xs text-primary">Default</span>}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{formatAccountDetails(method.details, method.method)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoonlighterPaymentMethods;
