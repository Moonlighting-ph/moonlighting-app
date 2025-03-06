
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import PaymentCard from '../components/PaymentCard';
import { getProviderPayments, getMoonlighterPayments } from '../services/paymentService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const isProvider = userProfile?.user_type === 'provider';

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user || !userProfile) return;

      try {
        let data;
        if (isProvider) {
          data = await getProviderPayments();
        } else {
          data = await getMoonlighterPayments();
        }
        setPayments(data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast('Failed to load your payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, userProfile, isProvider]);

  const handleProcessPayment = (paymentId: string) => {
    // In a real implementation, this would open a Stripe payment modal
    toast('Payment processing is not fully implemented in this demo', {
      description: 'This would normally open a Stripe payment flow'
    });
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'completed');
  const failedPayments = payments.filter(p => p.status === 'failed');

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {isProvider ? 'Provider Payments' : 'Moonlighter Earnings'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isProvider 
                ? 'Manage your payments to moonlighters for completed shifts.' 
                : 'Track your earnings from completed shifts.'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading your payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-10">
              <p>No payments found.</p>
            </div>
          ) : (
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="pending">
                  Pending ({pendingPayments.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedPayments.length})
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Failed ({failedPayments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingPayments.map(payment => (
                    <PaymentCard
                      key={payment.id}
                      amount={payment.amount}
                      currency={payment.currency}
                      status={payment.status}
                      jobTitle={payment.job_applications.job.title}
                      company={payment.job_applications.job.company}
                      counterpartyName={isProvider 
                        ? `${payment.job_applications.moonlighter.first_name} ${payment.job_applications.moonlighter.last_name}`
                        : `${payment.job_applications.provider.first_name} ${payment.job_applications.provider.last_name}`
                      }
                      date={payment.created_at}
                      onProcessPayment={() => handleProcessPayment(payment.id)}
                      isProvider={isProvider}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedPayments.map(payment => (
                    <PaymentCard
                      key={payment.id}
                      amount={payment.amount}
                      currency={payment.currency}
                      status={payment.status}
                      jobTitle={payment.job_applications.job.title}
                      company={payment.job_applications.job.company}
                      counterpartyName={isProvider 
                        ? `${payment.job_applications.moonlighter.first_name} ${payment.job_applications.moonlighter.last_name}`
                        : `${payment.job_applications.provider.first_name} ${payment.job_applications.provider.last_name}`
                      }
                      date={payment.updated_at}
                      isProvider={isProvider}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="failed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {failedPayments.map(payment => (
                    <PaymentCard
                      key={payment.id}
                      amount={payment.amount}
                      currency={payment.currency}
                      status={payment.status}
                      jobTitle={payment.job_applications.job.title}
                      company={payment.job_applications.job.company}
                      counterpartyName={isProvider 
                        ? `${payment.job_applications.moonlighter.first_name} ${payment.job_applications.moonlighter.last_name}`
                        : `${payment.job_applications.provider.first_name} ${payment.job_applications.provider.last_name}`
                      }
                      date={payment.updated_at}
                      onProcessPayment={() => handleProcessPayment(payment.id)}
                      isProvider={isProvider}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Payments;
