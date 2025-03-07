
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import PaymentMethodsList from './PaymentMethodsList';
import PaymentMethodForm from './PaymentMethodForm';

interface MoonlighterPaymentMethodsProps {
  userId: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await fetchPaymentMethods(userId);
      setPaymentMethods(methods);
      setError(null);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods');
      toast.error('Unable to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentMethods();
  }, [userId]);

  const handleDeleteMethod = async (id: string) => {
    try {
      await deletePaymentMethod(id);
      toast.success('Payment method deleted');
      loadPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      toast.success('Default payment method updated');
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method');
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = async () => {
    setIsAddingNew(false);
    await loadPaymentMethods();
  };

  const handleCancel = () => {
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2">Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center py-6 text-destructive">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={loadPaymentMethods}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isAddingNew ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm 
              userId={userId} 
              onSuccess={handleSaveNew} 
              onCancel={handleCancel} 
            />
          </CardContent>
        </Card>
      ) : (
        <PaymentMethodsList
          paymentMethods={paymentMethods}
          onDelete={handleDeleteMethod}
          onSetDefault={handleSetDefault}
          onAddNew={handleAddNew}
        />
      )}
    </div>
  );
};

export default MoonlighterPaymentMethods;
