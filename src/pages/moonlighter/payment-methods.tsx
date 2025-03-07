
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentMethodForm from '@/components/payments/PaymentMethodForm';
import PaymentMethodsList from '@/components/payments/PaymentMethodsList';

const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-primary mb-8">Payment Methods</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <PaymentMethodForm userId={session?.user?.id || ''} onSuccess={handleAddSuccess} />
              </div>
              <div>
                <PaymentMethodsList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default PaymentMethodsPage;
