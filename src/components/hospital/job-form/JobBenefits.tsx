
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Briefcase } from 'lucide-react';

interface JobBenefitsProps {
  benefitsText: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const JobBenefits: React.FC<JobBenefitsProps> = ({ benefitsText, handleChange }) => {
  return (
    <AccordionItem value="benefits">
      <AccordionTrigger className="text-base font-medium">
        <div className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" /> Benefits
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="benefitsText">Benefits (one per line)</Label>
          <Textarea
            id="benefitsText"
            name="benefitsText"
            placeholder="Enter job benefits, one per line..."
            value={benefitsText}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobBenefits;
