
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';

const PaymentMethodsPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  
  if (!session?.user) {
    navigate('/auth/login');
    return null;
  }
  
  const userId = session.user.id;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/moonlighter')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">Manage how you receive payments</p>
          </div>
          <Button onClick={() => navigate('/moonlighter/add-payment-method')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
        
        <MoonlighterPaymentMethods userId={userId} />
      </div>
      <Footer />
    </div>
  );
};

export default PaymentMethodsPage;
