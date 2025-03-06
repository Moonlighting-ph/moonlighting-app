
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ManualPayment } from '@/types/payment';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

export interface PaymentCardProps {
  payment: ManualPayment;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium capitalize">
            {payment.payment_method_type} Payment
          </h3>
        </div>
        <Badge className={getStatusColor(payment.status)} variant="outline">
          <span className="flex items-center gap-1">
            {getStatusIcon(payment.status)}
            <span className="capitalize">{payment.status}</span>
          </span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
          </div>
          {payment.reference_number && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference #</span>
              <span className="font-medium">{payment.reference_number}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{format(new Date(payment.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      {payment.notes && (
        <CardFooter className="border-t pt-4">
          <div className="w-full">
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-muted-foreground">{payment.notes}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
