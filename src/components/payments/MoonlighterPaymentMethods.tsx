
import React, { useEffect, useState } from 'react';
import { fetchMoonlighterPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CreditCard, Bank, Wallet, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MoonlighterPaymentMethodsProps {
  moonlighterId: string;
  onSelect?: (method: PaymentMethod) => void;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ 
  moonlighterId,
  onSelect
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!moonlighterId) return;
      
      setLoading(true);
      const data = await fetchMoonlighterPaymentMethods(moonlighterId);
      setMethods(data);
      setLoading(false);
    };

    fetchMethods();
  }, [moonlighterId]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
        return <Wallet className="h-5 w-5" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5" />;
      case 'bank':
        return <Bank className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-gray-500">
            The moonlighter has not added any payment methods yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moonlighter Payment Methods</CardTitle>
        <CardDescription>
          Available payment methods for this moonlighter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {methods.map((method) => (
            <div 
              key={method.id}
              className={`flex items-center p-4 rounded-lg border ${
                method.is_default ? 'border-primary/50 bg-primary/5' : 'border-border'
              } ${onSelect ? 'cursor-pointer hover:bg-accent' : ''}`}
              onClick={() => onSelect && onSelect(method)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-full ${method.is_default ? 'bg-primary/20' : 'bg-secondary'}`}>
                  {getMethodIcon(method.method)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium capitalize">{method.method}</h4>
                    {method.is_default && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{method.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
