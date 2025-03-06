
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { getManualPayments } from '@/services/manualPaymentService';
import PaymentCard from '@/components/PaymentCard';
import { ManualPayment } from '@/types/payment';

const Payments = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPayments = async () => {
      if (!auth.session?.user?.id) return;
      
      try {
        setLoading(true);
        const data = await getManualPayments();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [auth.session?.user?.id]);
  
  const handleMakePayment = () => {
    navigate('/provider/make-payment');
  };
  
  if (!auth.session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please sign in to view your payments.</p>
            <Button onClick={() => navigate('/auth/login')} className="mt-4">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        {auth.userType === 'provider' && (
          <Button onClick={handleMakePayment}>Make Payment</Button>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PaymentsList payments={payments} loading={loading} />
        </TabsContent>
        
        <TabsContent value="completed">
          <PaymentsList 
            payments={payments.filter(p => p.status === 'completed')} 
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <PaymentsList 
            payments={payments.filter(p => p.status === 'pending')} 
            loading={loading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PaymentsListProps {
  payments: ManualPayment[];
  loading: boolean;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading payments...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No payments found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4">
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}
    </div>
  );
};

export default Payments;
