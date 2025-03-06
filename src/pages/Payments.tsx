
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { PaymentCard } from '@/components/PaymentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualPayment } from '@/types/payment';
import { getManualPayments } from '@/services/manualPaymentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Payments: React.FC = () => {
  const { session } = useAuth();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get user type from session metadata
  const userType = session?.user.user_metadata.user_type as 'moonlighter' | 'provider';

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const paymentData = await getManualPayments(session.user.id, userType);
        setPayments(paymentData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPayments();
    }
  }, [session, userType]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Payment History</h1>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <PaymentList 
              payments={payments} 
              loading={loading} 
              emptyMessage="No payment history found."
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <PaymentList 
              payments={payments.filter(p => p.status === 'completed')} 
              loading={loading} 
              emptyMessage="No completed payments found."
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <PaymentList 
              payments={payments.filter(p => p.status === 'pending')} 
              loading={loading} 
              emptyMessage="No pending payments found."
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

interface PaymentListProps {
  payments: ManualPayment[];
  loading: boolean;
  emptyMessage: string;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading payments...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}
    </div>
  );
};

export default Payments;
