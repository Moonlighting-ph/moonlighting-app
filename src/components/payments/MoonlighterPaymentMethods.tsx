
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentMethodForm from './PaymentMethodForm';
import PaymentMethodsList from './PaymentMethodsList';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { toast } from 'sonner';

interface MoonlighterPaymentMethodsProps {
  userId: string;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ userId }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const fetchPaymentMethodsData = async () => {
    try {
      setLoading(true);
      const data = await fetchPaymentMethods(userId);
      setMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchPaymentMethodsData();
    }
  }, [userId]);
  
  const handleAddComplete = async () => {
    setShowAddForm(false);
    await fetchPaymentMethodsData();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Add your payment methods to receive payments from healthcare providers
        </CardDescription>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="mt-2"
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading payment methods...</p>
        ) : (
          <PaymentMethodsList 
            methods={methods} 
            userId={userId} 
            onUpdate={fetchPaymentMethodsData} 
          />
        )}
      </CardContent>
      
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a payment method for receiving payments
            </DialogDescription>
          </DialogHeader>
          <PaymentMethodForm 
            userId={userId} 
            onComplete={handleAddComplete} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
