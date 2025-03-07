
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ManualPayment } from '@/types/payment';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentCardProps {
  payment: ManualPayment;
  userType: 'provider' | 'moonlighter'; // Add userType prop
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, userType }) => {
  let statusColor = '';
  switch (payment.status) {
    case 'completed':
      statusColor = 'text-green-600 bg-green-50';
      break;
    case 'pending':
      statusColor = 'text-yellow-600 bg-yellow-50';
      break;
    case 'failed':
      statusColor = 'text-red-600 bg-red-50';
      break;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Payment {payment.reference_number ? `#${payment.reference_number}` : ''}
            </CardTitle>
            <CardDescription>
              {payment.job_id ? 'Job Payment' : 'General Payment'}
            </CardDescription>
          </div>
          <Badge className={statusColor} variant="outline">
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-semibold">{formatCurrency(payment.amount)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Method:</span>
            <span>{payment.payment_method_type.toUpperCase()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span>{payment.created_at ? formatDate(payment.created_at) : 'N/A'}</span>
          </div>
          
          {payment.payment_details && (
            <div className="flex justify-between">
              <span className="text-gray-500">Details:</span>
              <span className="text-right">{payment.payment_details}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t flex justify-end">
        {userType === 'provider' && payment.status === 'pending' && (
          <div className="space-x-2">
            <Button size="sm" variant="outline">Confirm</Button>
            <Button size="sm" variant="destructive">Reject</Button>
          </div>
        )}
        {userType === 'moonlighter' && payment.status === 'pending' && (
          <Button size="sm" variant="outline">View Details</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentCard;
