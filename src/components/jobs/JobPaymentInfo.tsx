
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface JobPaymentInfoProps {
  salary: string;
}

const JobPaymentInfo: React.FC<JobPaymentInfoProps> = ({ salary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1">Payment Method</h3>
            <p className="text-lg">Direct deposit</p>
          </div>
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1">Frequency</h3>
            <p className="text-lg">Bi-monthly</p>
          </div>
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1">Rate</h3>
            <p className="text-lg">{salary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPaymentInfo;
