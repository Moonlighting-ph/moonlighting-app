
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualPayment } from '@/types/payment';
import { getManualPayments } from '@/services/manualPaymentService';
import { PaymentCard } from '@/components/PaymentCard';
import { toast } from 'sonner';

const Payments: React.FC = () => {
  const { user, session } = useAuth();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'provider' | 'moonlighter' | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        if (data && (data.user_type === 'provider' || data.user_type === 'moonlighter')) {
          setUserType(data.user_type);
        }
      } catch (err) {
        console.error('Error fetching user type:', err);
      }
    };
    
    fetchUserType();
  }, [session]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id || !userType) return;
      
      try {
        setLoading(true);
        const data = await getManualPayments(user.id, userType);
        
        // Ensure we're getting the correct type
        const validPayments = data.map(payment => ({
          ...payment,
          payment_method_type: validatePaymentMethodType(payment.payment_method_type)
        }));
        
        setPayments(validPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [user, userType]);

  // Helper function to validate payment method type
  const validatePaymentMethodType = (type: string): 'gcash' | 'paymaya' | 'bank' => {
    const validTypes = ['gcash', 'paymaya', 'bank'] as const;
    return validTypes.includes(type as any) ? (type as 'gcash' | 'paymaya' | 'bank') : 'gcash';
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p>Loading user information...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>Loading payments...</p>
                </CardContent>
              </Card>
            ) : payments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>No payment history found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>Loading payments...</p>
                </CardContent>
              </Card>
            ) : payments.filter(p => p.status === 'completed').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>No completed payments found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments
                  .filter(p => p.status === 'completed')
                  .map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>Loading payments...</p>
                </CardContent>
              </Card>
            ) : payments.filter(p => p.status === 'pending').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p>No pending payments found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments
                  .filter(p => p.status === 'pending')
                  .map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
