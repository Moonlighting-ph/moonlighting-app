
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import PaymentMethodForm from '@/components/payments/PaymentMethodForm';
import PaymentMethodsList from '@/components/payments/PaymentMethodsList';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Payment method added successfully');
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleMethodDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!session) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Please sign in to manage your payment methods.</p>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Payment Methods</h1>
            {!showForm && (
              <Button onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Method
              </Button>
            )}
          </div>

          {showForm ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add Payment Method</h2>
              <PaymentMethodForm 
                onSuccess={handleFormSubmitSuccess} 
                onCancel={handleCancelForm}
                userId={session.user.id}
              />
            </div>
          ) : null}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <PaymentMethodsList 
              userId={session.user.id} 
              onMethodDeleted={handleMethodDeleted}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default PaymentMethodsPage;
