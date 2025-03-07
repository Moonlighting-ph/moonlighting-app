import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchPaymentsByProvider, fetchPaymentsByMoonlighter } from '@/services/manualPaymentService';
import PaymentCard from '@/components/PaymentCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Navigate } from 'react-router-dom';

const Payments = () => {
  const { session, loading } = useAuth();
  const [providerPayments, setProviderPayments] = useState([]);
  const [moonlighterPayments, setMoonlighterPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      if (!session) return;

      try {
        setLoadingPayments(true);
        const providerId = session.user.id;
        const moonlighterId = session.user.id; // Assuming the moonlighter ID is the same for this example

        const providerPaymentsData = await fetchPaymentsByProvider(providerId);
        const moonlighterPaymentsData = await fetchPaymentsByMoonlighter(moonlighterId);

        setProviderPayments(providerPaymentsData);
        setMoonlighterPayments(moonlighterPaymentsData);
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    loadPayments();
  }, [session]);

  if (loading || loadingPayments) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Payments</h1>

          {providerPayments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {providerPayments.map((payment) => (
                <PaymentCard 
                  key={payment.id} 
                  payment={payment}
                  userType="provider"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No outgoing payments found.</p>
          )}

          {moonlighterPayments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {moonlighterPayments.map((payment) => (
                <PaymentCard 
                  key={payment.id} 
                  payment={payment}
                  userType="moonlighter"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No incoming payments found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payments;
