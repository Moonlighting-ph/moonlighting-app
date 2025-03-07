
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createPaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod, PaymentMethodType, PaymentMethodFormProps } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSuccess, onCancel }) => {
  const { session } = useAuth();
  const [type, setType] = useState<PaymentMethodType>('bank_account');
  const [isDefault, setIsDefault] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('You must be logged in to add a payment method');
      return;
    }

    // Validation
    if (type === 'bank_account') {
      if (!bankName || !accountName || !accountNumber) {
        toast.error('Please fill in all bank account details');
        return;
      }
    } else if ((type === 'gcash' || type === 'paymaya') && !phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      
      let details: Record<string, any> = {};
      
      if (type === 'bank_account') {
        details = {
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber
        };
      } else if (type === 'gcash' || type === 'paymaya') {
        details = {
          phone: phoneNumber
        };
      }
      
      const newMethod = await createPaymentMethod(
        session.user.id,
        type,
        details,
        isDefault
      );
      
      toast.success('Payment method added successfully');
      onSuccess(newMethod);
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Payment Method Type</Label>
        <RadioGroup value={type} onValueChange={(value) => setType(value as PaymentMethodType)} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank_account" id="bank_account" />
            <Label htmlFor="bank_account">Bank Account</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gcash" id="gcash" />
            <Label htmlFor="gcash">GCash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paymaya" id="paymaya" />
            <Label htmlFor="paymaya">PayMaya</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Bank Account Details */}
      {type === 'bank_account' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input 
              id="bank_name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., BDO, BPI, Metrobank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Input 
              id="account_name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Name on the account"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input 
              id="account_number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account number"
            />
          </div>
        </div>
      )}

      {/* GCash or PayMaya Details */}
      {(type === 'gcash' || type === 'paymaya') && (
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input 
            id="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 09XXXXXXXXX"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="default"
          checked={isDefault}
          onCheckedChange={(checked) => setIsDefault(checked === true)}
        />
        <Label htmlFor="default">Make this my default payment method</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
