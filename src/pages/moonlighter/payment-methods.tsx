
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
        
        {session?.user ? (
          <div className="max-w-3xl mx-auto">
            <MoonlighterPaymentMethods userId={session.user.id} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Please sign in to manage your payment methods.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentMethodsPage;
