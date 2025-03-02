
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from 'lucide-react';

interface JobRequirementsProps {
  requirementsText: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const JobRequirements: React.FC<JobRequirementsProps> = ({ 
  requirementsText, 
  handleChange 
}) => {
  return (
    <AccordionItem value="requirements">
      <AccordionTrigger className="text-base font-medium">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" /> Job Requirements
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="requirementsText">Requirements (one per line)</Label>
          <Textarea
            id="requirementsText"
            name="requirementsText"
            placeholder="Enter job requirements, one per line..."
            value={requirementsText}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobRequirements;
