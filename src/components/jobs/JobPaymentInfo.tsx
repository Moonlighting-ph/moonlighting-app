
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface JobPaymentInfoProps {
  salary: string;
  compensation_details?: {
    base_salary?: string;
    benefits_value?: string;
    bonus_structure?: string;
    payment_frequency?: string;
  };
}

const JobPaymentInfo: React.FC<JobPaymentInfoProps> = ({ salary, compensation_details }) => {
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
            <p className="text-lg">{compensation_details?.payment_frequency || 'Bi-monthly'}</p>
          </div>
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-1">Rate</h3>
            <p className="text-lg">{salary}</p>
          </div>
        </div>
        
        {compensation_details && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {compensation_details.base_salary && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-1">Base Salary</h3>
                <p className="text-lg">{compensation_details.base_salary}</p>
              </div>
            )}
            
            {compensation_details.benefits_value && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-1">Benefits Value</h3>
                <p className="text-lg">{compensation_details.benefits_value}</p>
              </div>
            )}
            
            {compensation_details.bonus_structure && (
              <div className="border rounded-lg p-4 col-span-1 sm:col-span-2">
                <h3 className="text-sm font-medium mb-1">Bonus Structure</h3>
                <p className="text-lg">{compensation_details.bonus_structure}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPaymentInfo;
