
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { addPaymentMethod } from '@/services/paymentMethodService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodFormProps {
  onSuccess?: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSuccess }) => {
  const [method, setMethod] = useState<'gcash' | 'paymaya' | 'bank'>('gcash');
  const [details, setDetails] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getPlaceholder = () => {
    switch(method) {
      case 'gcash':
        return 'Enter GCash number (e.g., 09123456789)';
      case 'paymaya':
        return 'Enter PayMaya number (e.g., 09123456789)';
      case 'bank':
        return 'Enter bank name, account number, and account name';
      default:
        return 'Enter payment details';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!details.trim()) {
      setError('Payment details are required');
      setLoading(false);
      return;
    }

    const result = await addPaymentMethod(method, details, isDefault);
    
    setLoading(false);
    
    if (result) {
      setSuccess(true);
      setDetails('');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
        <CardDescription>
          Add your payment details so healthcare providers can send you payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>Payment method added successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={method}
              onValueChange={(value: any) => setMethod(value)}
            >
              <SelectTrigger id="payment-method" className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gcash">GCash</SelectItem>
                <SelectItem value="paymaya">PayMaya</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-details">Payment Details</Label>
            <Input
              id="payment-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={getPlaceholder()}
              required
            />
            {method === 'bank' && (
              <p className="text-xs text-gray-500 mt-1">
                Format: Bank Name - Account Number - Account Name
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="default" 
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked as boolean)}
            />
            <Label htmlFor="default" className="text-sm font-normal">
              Set as default payment method
            </Label>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Payment Method'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodForm;
