
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentCard from '@/components/PaymentCard';
import { fetchMoonlighterPayments, fetchProviderPayments } from '@/services/manualPaymentService';
import { ManualPayment } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';

const Payments: React.FC = () => {
  const { session } = useAuth();
  const [userType, setUserType] = useState<'provider' | 'moonlighter' | null>(null);
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchUserType = async () => {
      if (!session?.user?.id) return;
      
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
        
        if (data?.user_type === 'provider' || data?.user_type === 'moonlighter') {
          setUserType(data.user_type);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };
    
    fetchUserType();
  }, [session]);
  
  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id || !userType) return;
      
      setLoading(true);
      
      try {
        let paymentData: ManualPayment[] = [];
        
        if (userType === 'moonlighter') {
          paymentData = await fetchMoonlighterPayments(session.user.id);
        } else if (userType === 'provider') {
          paymentData = await fetchProviderPayments(session.user.id);
        }
        
        setPayments(paymentData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [session, userType]);
  
  const filteredPayments = activeTab === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === activeTab);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Payments</h1>
            {userType === 'provider' && (
              <Button>Make a Payment</Button>
            )}
          </div>
          
          <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-gray-500 mb-4">
                {activeTab !== 'all' 
                  ? `You don't have any ${activeTab} payments.` 
                  : 'You have not made or received any payments yet.'}
              </p>
              {userType === 'provider' && (
                <Button>Make Your First Payment</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPayments.map(payment => (
                <PaymentCard 
                  key={payment.id} 
                  payment={payment} 
                  userType={userType as 'provider' | 'moonlighter'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payments;
