
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentCard from '@/components/PaymentCard';
import { Payment, ManualPayment } from '@/types/payment';

const Payments: React.FC = () => {
  const { session } = useAuth();
  const [isProvider, setIsProvider] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [outgoingPayments, setOutgoingPayments] = useState<any[]>([]);
  const [incomingPayments, setIncomingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserType = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user type:", error);
          return;
        }
        
        const userType = data?.user_type;
        setUserType(userType);
        setIsProvider(userType === 'provider');
      } catch (err) {
        console.error("Error determining user type:", err);
      }
    };
    
    getUserType();
  }, [session]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id || !userType) return;
      
      try {
        setLoading(true);
        
        if (userType === 'provider') {
          // Fetch outgoing payments (provider is the payer)
          const { data: providerPayments, error: providerError } = await supabase
            .from('payments')
            .select('*')
            .eq('provider_id', session.user.id)
            .order('created_at', { ascending: false });
          
          if (providerError) throw providerError;
          setOutgoingPayments(providerPayments || []);
          setIncomingPayments([]);
        } else if (userType === 'moonlighter') {
          // Fetch incoming payments (moonlighter is the payee)
          const { data: moonlighterPayments, error: moonlighterError } = await supabase
            .from('payments')
            .select('*')
            .eq('moonlighter_id', session.user.id)
            .order('created_at', { ascending: false });
          
          if (moonlighterError) throw moonlighterError;
          setIncomingPayments(moonlighterPayments || []);
          setOutgoingPayments([]);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [session, userType]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Payments</h1>
          
          {loading ? (
            <div className="text-center py-10">Loading payment history...</div>
          ) : (
            <div className="space-y-8">
              {isProvider && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Outgoing Payments</h2>
                  {outgoingPayments.length === 0 ? (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No outgoing payments yet.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {outgoingPayments.map((payment: any) => (
                        <PaymentCard key={payment.id} payment={payment} />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {!isProvider && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Incoming Payments</h2>
                  {incomingPayments.length === 0 ? (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No incoming payments yet.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {incomingPayments.map((payment: any) => (
                        <PaymentCard key={payment.id} payment={payment} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;
