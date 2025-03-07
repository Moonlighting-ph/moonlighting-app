
import React, { useEffect, useState } from 'react';
import { PaymentMethod } from '@/types/payment';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PaymentMethodsList from './PaymentMethodsList';

export interface MoonlighterPaymentMethodsProps {
  moonlighterId: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ 
  moonlighterId 
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await fetchPaymentMethods(moonlighterId);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moonlighterId) {
      loadPaymentMethods();
    }
  }, [moonlighterId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moonlighter's Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <PaymentMethodsList 
            methods={paymentMethods} 
            userId={moonlighterId}
            onUpdate={loadPaymentMethods}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
