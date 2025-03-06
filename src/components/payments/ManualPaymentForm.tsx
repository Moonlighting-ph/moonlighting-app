
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createManualPayment } from '@/services/manualPaymentService';
import { fetchMoonlighterPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/types/payment';
import { Loader2, Check, AlertCircle, CreditCard, Bank, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ManualPaymentFormProps {
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  onSuccess?: () => void;
}

const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  moonlighterId,
  jobId,
  applicationId,
  onSuccess
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchMethods = async () => {
      if (!moonlighterId) return;
      
      setMethodsLoading(true);
      const data = await fetchMoonlighterPaymentMethods(moonlighterId);
      setPaymentMethods(data);
      
      // If there's a default method, select it
      const defaultMethod = data.find(m => m.is_default);
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
      } else if (data.length > 0) {
        setSelectedMethodId(data[0].id);
      }
      
      setMethodsLoading(false);
    };

    fetchMethods();
  }, [moonlighterId]);

  const getSelectedMethod = () => {
    return paymentMethods.find(m => m.id === selectedMethodId);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gcash':
        return <Wallet className="h-5 w-5" />;
      case 'paymaya':
        return <CreditCard className="h-5 w-5" />;
      case 'bank':
        return <Bank className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    const selectedMethod = getSelectedMethod();
    if (!selectedMethod) {
      setError('Please select a payment method');
      setLoading(false);
      return;
    }

    const result = await createManualPayment(
      moonlighterId,
      jobId,
      applicationId,
      parseFloat(amount),
      selectedMethod.method,
      selectedMethod.details,
      selectedMethod.id,
      referenceNumber,
      notes
    );
    
    setLoading(false);
    
    if (result) {
      setSuccess(true);
      // Reset form
      setAmount('');
      setReferenceNumber('');
      setNotes('');
      
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Payment to Moonlighter</CardTitle>
        <CardDescription>
          Record a manual payment you've sent to this moonlighter
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
              <AlertDescription>Payment recorded successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (PHP)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            {methodsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The moonlighter has not added any payment methods yet.
                </AlertDescription>
              </Alert>
            ) : (
              <RadioGroup
                value={selectedMethodId || ''}
                onValueChange={setSelectedMethodId}
                className="space-y-2"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      selectedMethodId === method.id ? 'border-primary' : 'border-input'
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={`method-${method.id}`} />
                    <Label
                      htmlFor={`method-${method.id}`}
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="p-2 rounded-full bg-secondary">
                          {getMethodIcon(method.method)}
                        </div>
                        <div>
                          <h4 className="font-medium capitalize">{method.method}</h4>
                          <p className="text-sm text-gray-500">{method.details}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number / Transaction ID (Optional)</Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter payment reference number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about this payment"
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={loading || paymentMethods.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManualPaymentForm;
