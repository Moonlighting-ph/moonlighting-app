
import React, { useEffect, useState } from 'react';
import { PaymentMethod } from '@/types/payment';
import { fetchUserPaymentMethods } from '@/services/paymentMethodService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CreditCard } from 'lucide-react';

interface MoonlighterPaymentMethodsProps {
  moonlighterId: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ moonlighterId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await fetchUserPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching moonlighter payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    if (moonlighterId) {
      fetchPaymentMethods();
    }
  }, [moonlighterId]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
      case 'paymaya':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            This moonlighter hasn't added any payment methods yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Payment Methods</h3>
      {paymentMethods.map((method) => (
        <Card key={method.id} className={method.is_default ? 'border-primary' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {getMethodIcon(method.method)}
              {method.method === 'gcash' ? 'GCash' : 
               method.method === 'paymaya' ? 'PayMaya' : 
               'Bank Transfer'}
              {method.is_default && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 ml-2">
                  Default
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{method.details}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MoonlighterPaymentMethods;
