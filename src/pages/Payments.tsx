
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualPayment } from '@/types/payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getManualPayments } from '@/services/manualPaymentService';
import { supabase } from '@/integrations/supabase/client';

const PaymentCard: React.FC<{ payment: ManualPayment }> = ({ payment }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Payment #{payment.reference_number || payment.id.slice(0, 8)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Amount:</strong> ₱{payment.amount.toFixed(2)}</p>
          <p><strong>Method:</strong> {payment.payment_method_type}</p>
          <p><strong>Status:</strong> <span className={`font-medium ${
            payment.status === 'completed' ? 'text-green-600' : 
            payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>{payment.status}</span></p>
          <p><strong>Details:</strong> {payment.payment_details}</p>
          <p><strong>Date:</strong> {new Date(payment.created_at).toLocaleDateString()}</p>
          {payment.notes && <p><strong>Notes:</strong> {payment.notes}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const Payments: React.FC = () => {
  const { session } = useAuth();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

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
        
        setUserType(data.user_type);
        
        // Fetch payments
        if (data.user_type) {
          const fetchedPayments = await getManualPayments(session.user.id, data.user_type);
          setPayments(fetchedPayments);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserType();
  }, [session]);

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Payments</h1>
          
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Payment History</TabsTrigger>
              {userType === 'moonlighter' && (
                <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="history" className="mt-4">
              {loading ? (
                <p className="text-center p-8">Loading payment history...</p>
              ) : payments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No payment history found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {payments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {userType === 'moonlighter' && (
              <TabsContent value="methods" className="mt-4">
                {/* Payment methods component would go here */}
                <p>Payment methods component</p>
              </TabsContent>
            )}
          </Tabs>
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Payments;
