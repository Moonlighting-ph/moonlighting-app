
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign } from 'lucide-react';

interface JobCompensationProps {
  salary: string;
  baseSalary: string;
  benefitsValue: string;
  paymentFrequency: string;
  bonusStructure: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const JobCompensation: React.FC<JobCompensationProps> = ({
  salary,
  baseSalary,
  benefitsValue,
  paymentFrequency,
  bonusStructure,
  handleChange,
  handleSelectChange
}) => {
  return (
    <AccordionItem value="compensation">
      <AccordionTrigger className="text-base font-medium">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" /> Compensation Details
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range*</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g., ₱20,000 - ₱25,000 per month"
                value={salary}
                onChange={handleChange}
                required
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  placeholder="e.g., ₱20,000"
                  value={baseSalary}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="benefitsValue">Benefits Value</Label>
                <Input
                  id="benefitsValue"
                  name="benefitsValue"
                  placeholder="e.g., ₱5,000"
                  value={benefitsValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <Select
                  value={paymentFrequency}
                  onValueChange={(value) => handleSelectChange('paymentFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Bi-monthly">Bi-monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonusStructure">Bonus Structure</Label>
                <Input
                  id="bonusStructure"
                  name="bonusStructure"
                  placeholder="e.g., Performance-based bonuses"
                  value={bonusStructure}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobCompensation;
