
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';
import { Navigate } from 'react-router-dom';

const PaymentMethodsPage: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Payment Methods</h1>
          <MoonlighterPaymentMethods userId={session.user.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentMethodsPage;
