import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentMethod } from '@/types/payment';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentMethodsList from '@/components/payments/PaymentMethodsList';
import PaymentMethodForm from '@/components/payments/PaymentMethodForm';
import { toast } from 'sonner';

// Update the PaymentMethodsList props to include refreshTrigger
interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  userId: string;
  onRefresh?: () => void;
}

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const methods = await fetchPaymentMethods(session.user.id);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, [session, refreshTrigger]);

return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PaymentMethodsList 
            paymentMethods={paymentMethods} 
            userId={session?.user?.id || ''} 
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
        
        <div>
          <PaymentMethodForm 
            userId={session?.user?.id || ''} 
            onSuccess={() => setRefreshTrigger(prev => prev + 1)} 
          />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
};

export default PaymentMethodsPage;
