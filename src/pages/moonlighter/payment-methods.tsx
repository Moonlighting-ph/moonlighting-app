
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PaymentMethodsList from '@/components/payments/PaymentMethodsList';
import PaymentMethodForm from '@/components/payments/PaymentMethodForm';
import { toast } from 'sonner';

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    if (!session) {
      toast.error('You need to be logged in to access this page');
    }
  }, [session]);
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Payment method added successfully');
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
  };
  
  if (!session) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
          <p>Please sign in to manage your payment methods.</p>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Payment Methods</h1>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </div>
          
          <PaymentMethodsList userId={session.user.id} refreshTrigger={refreshTrigger} />
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[500px] p-0">
              <PaymentMethodForm 
                userId={session.user.id} 
                onSuccess={handleFormSuccess} 
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethodsPage;
