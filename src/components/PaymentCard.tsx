
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PaymentCardProps {
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  jobTitle: string;
  company: string;
  counterpartyName: string;
  date: string;
  onProcessPayment?: () => void;
  isProvider?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  amount,
  currency,
  status,
  jobTitle,
  company,
  counterpartyName,
  date,
  onProcessPayment,
  isProvider = false,
}) => {
  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency || 'PHP',
  }).format(amount);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{formattedAmount}</CardTitle>
            <CardDescription>{jobTitle} at {company}</CardDescription>
          </div>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p className="text-sm">
            {isProvider ? 'Payment to:' : 'Payment from:'} <span className="font-medium">{counterpartyName}</span>
          </p>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {status === 'pending' && onProcessPayment && (
          <Button 
            onClick={onProcessPayment}
            className="w-full"
            variant={isProvider ? 'default' : 'outline'}
          >
            {isProvider ? 'Make Payment' : 'View Payment'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentCard;
