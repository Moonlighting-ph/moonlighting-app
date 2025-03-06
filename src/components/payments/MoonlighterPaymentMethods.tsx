
import React, { useEffect, useState } from 'react';
import { PaymentMethod } from '@/types/payment';
import { getUserPaymentMethods } from '@/services/paymentMethodService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, Building } from 'lucide-react';

export interface MoonlighterPaymentMethodsProps {
  moonlighterId: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ moonlighterId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!moonlighterId) return;
      
      try {
        setLoading(true);
        const methods = await getUserPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [moonlighterId]);

  const getIcon = (method: string) => {
    switch (method) {
      case 'gcash':
        return <Wallet className="w-5 h-5 text-blue-500" />;
      case 'paymaya':
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      case 'bank':
        return <Building className="w-5 h-5 text-green-500" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No payment methods available for this moonlighter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className="p-4 border rounded-lg flex items-start gap-3"
            >
              <div className="mt-1">{getIcon(method.method)}</div>
              <div>
                <div className="font-medium capitalize">{method.method}</div>
                <div className="text-sm text-muted-foreground break-all">{method.details}</div>
                {method.is_default && (
                  <div className="mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">Default</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
