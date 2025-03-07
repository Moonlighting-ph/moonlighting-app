
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ManualPayment } from '@/types/payment';
import { getManualPayments } from '@/services/manualPaymentService';
import PaymentCard from '@/components/PaymentCard';
import { toast } from 'sonner';

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [userType, setUserType] = useState<"provider" | "moonlighter" | null>(null);
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!session) {
      navigate('/auth/login');
      return;
    }

    const fetchUserType = async () => {
      try {
        // Fetch the user's type from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data && (data.user_type === 'provider' || data.user_type === 'moonlighter')) {
          setUserType(data.user_type);
        } else {
          // Handle unexpected user type
          toast.error('Invalid user type for payment access');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
        toast.error('Failed to fetch user data');
      }
    };

    fetchUserType();
  }, [session, navigate]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id || !userType) return;
      
      try {
        setLoading(true);
        const userPayments = await getManualPayments(session.user.id, userType);
        setPayments(userPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    if (userType) {
      fetchPayments();
    }
  }, [session, userType]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6">Payments</h1>
          <p>Loading payment information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Payments</h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No payments found.</p>
                    {userType === 'provider' && (
                      <p className="mt-2">
                        <button 
                          onClick={() => navigate('/provider/make-payment')}
                          className="text-primary hover:underline"
                        >
                          Make a payment
                        </button>
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {payments.filter(p => p.status === 'pending').length > 0 ? (
                payments
                  .filter(p => p.status === 'pending')
                  .map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No pending payments.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {payments.filter(p => p.status === 'completed').length > 0 ? (
                payments
                  .filter(p => p.status === 'completed')
                  .map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No completed payments.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
