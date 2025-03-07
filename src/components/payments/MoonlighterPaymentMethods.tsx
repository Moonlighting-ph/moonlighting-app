
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';
import { fetchUserPaymentMethods } from '@/services/paymentMethodService'; 
import PaymentMethodsList from './PaymentMethodsList';
import PaymentMethodForm from './PaymentMethodForm';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MoonlighterPaymentMethodsProps {
  limit?: number;
}

const MoonlighterPaymentMethods: React.FC<MoonlighterPaymentMethodsProps> = ({ limit }) => {
  const { session } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const methods = await fetchUserPaymentMethods(session.user.id);
        
        // Apply limit if specified
        if (limit && methods.length > limit) {
          setPaymentMethods(methods.slice(0, limit));
        } else {
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [session, limit]);

  const handleMethodAdded = async () => {
    if (!session?.user) return;
    
    try {
      setShowAddMethodDialog(false);
      const updatedMethods = await fetchUserPaymentMethods(session.user.id);
      
      // Apply limit if specified
      if (limit && updatedMethods.length > limit) {
        setPaymentMethods(updatedMethods.slice(0, limit));
      } else {
        setPaymentMethods(updatedMethods);
      }
      
      toast.success('Payment method added successfully');
    } catch (error) {
      console.error('Error refreshing payment methods:', error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods for receiving payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading payment methods...</div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">You haven't added any payment methods yet</p>
            <Button onClick={() => setShowAddMethodDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <PaymentMethodsList 
              methods={paymentMethods} 
              onMethodsChanged={handleMethodAdded}
            />
            
            <div className="flex justify-end">
              <Button onClick={() => setShowAddMethodDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </div>
          </div>
        )}
        
        <Dialog open={showAddMethodDialog} onOpenChange={setShowAddMethodDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method for receiving payments
              </DialogDescription>
            </DialogHeader>
            
            {session?.user && (
              <PaymentMethodForm
                userId={session.user.id}
                onComplete={handleMethodAdded}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MoonlighterPaymentMethods;
