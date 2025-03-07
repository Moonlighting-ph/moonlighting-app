
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';
import PaymentMethodsList from './PaymentMethodsList';
import PaymentMethodForm from './PaymentMethodForm';
import { fetchPaymentMethods } from '@/services/paymentMethodService';

const MoonlighterPaymentMethods: React.FC = () => {
  const { session } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, [session]);

  const loadPaymentMethods = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const paymentMethods = await fetchPaymentMethods(session.user.id);
      setMethods(paymentMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newMethod: PaymentMethod) => {
    setMethods(prev => [newMethod, ...prev]);
    setShowForm(false);
  };

  const handleDeleteMethod = (deletedId: string) => {
    setMethods(prev => prev.filter(method => method.id !== deletedId));
  };

  const handleCancelAdd = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading payment methods...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)} 
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Method
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm 
              onSuccess={handleAddSuccess}
              onCancel={handleCancelAdd}
            />
          </CardContent>
        </Card>
      ) : (
        <PaymentMethodsList methods={methods} onDelete={handleDeleteMethod} />
      )}
    </div>
  );
};

export default MoonlighterPaymentMethods;
