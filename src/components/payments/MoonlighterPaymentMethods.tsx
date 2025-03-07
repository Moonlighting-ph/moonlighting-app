import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import PaymentMethodsList from './PaymentMethodsList';
import PaymentMethodForm from './PaymentMethodForm';
import { fetchUserPaymentMethods, deletePaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';

export interface MoonlighterPaymentMethodsProps {
  userId: string;
  onMethodAdded?: () => void;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ 
  userId,
  onMethodAdded 
}) => {
  const { session } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const methods = await fetchUserPaymentMethods(session.user.id);
        setMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [session]);

  const handleAddMethodComplete = async () => {
    if (!session?.user) return;
    
    try {
      const updatedMethods = await fetchUserPaymentMethods(session.user.id);
      setMethods(updatedMethods);
      toast.success('Payment method added successfully');
    } catch (error) {
      console.error('Error refreshing payment methods:', error);
    }
  };

  const handleMethodRemoved = async (methodId: string) => {
    if (!session?.user) return;
    
    try {
      await deletePaymentMethod(session.user.id, methodId);
      const updatedMethods = await fetchUserPaymentMethods(session.user.id);
      setMethods(updatedMethods);
      toast.success('Payment method removed successfully');
    } catch (error) {
      console.error('Error removing payment method:', error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm ? (
          <PaymentMethodForm 
            userId={userId} 
            onComplete={handleAddMethodComplete} 
          />
        ) : (
          <Button 
            onClick={() => setShowForm(true)} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Payment Method
          </Button>
        )}
        
        {methods.length > 0 && (
          <PaymentMethodsList 
            methods={methods} 
            onMethodsChanged={fetchMethods} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
