
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Payment, ManualPayment } from '@/types/payment';

export interface PaymentCardProps {
  payment: Payment | ManualPayment;
  userType: 'provider' | 'moonlighter';
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, userType }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if payment is a ManualPayment by checking for reference_number property
  const isManualPayment = (payment: Payment | ManualPayment): payment is ManualPayment => {
    return 'reference_number' in payment;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {formatCurrency(payment.amount)}
            </CardTitle>
            <CardDescription>
              {isManualPayment(payment) && payment.reference_number && (
                <>Ref: {payment.reference_number.substring(0, 8)}</>
              )}
              {!isManualPayment(payment) && (
                <>Payment</>
              )}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(payment.status)}>
            {payment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>
          {userType === 'provider' ? 'To: ' : 'From: '}
          <span className="font-medium">
            {userType === 'provider' ? 'Moonlighter' : 'Provider'}
          </span>
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        {isManualPayment(payment) && payment.receipt_url && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open(payment.receipt_url, '_blank')}
          >
            View Receipt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentCard;
