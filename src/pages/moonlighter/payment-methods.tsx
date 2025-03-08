import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  const userId = session?.user?.id || '';

  return (
    <Container>
      <Heading>Payment Methods</Heading>
      {userId && <MoonlighterPaymentMethods />}
    </Container>
  );
};

export default PaymentMethodsPage;
