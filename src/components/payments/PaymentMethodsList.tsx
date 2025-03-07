
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Trash } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';
import { deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { toast } from 'sonner';

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  userId: string;
  onUpdate: () => Promise<void>;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods, userId, onUpdate }) => {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deletePaymentMethod(id, userId);
      await onUpdate();
      toast.success('Payment method deleted');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsSettingDefault(id);
      await setDefaultPaymentMethod(id, userId);
      await onUpdate();
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    } finally {
      setIsSettingDefault(null);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank':
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (!methods.length) {
    return <p className="text-gray-500 text-center py-4">No payment methods added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div key={method.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
          <div className="flex items-center gap-3">
            {getPaymentIcon(method.method)}
            <div>
              <p className="font-medium">
                {method.method}
                {method.is_default && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">{method.details}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!method.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(method.id)}
                disabled={!!isSettingDefault}
              >
                {isSettingDefault === method.id ? 'Setting...' : 'Set Default'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(method.id)}
              disabled={!!isDeleting}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
