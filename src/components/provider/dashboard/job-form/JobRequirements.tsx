
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JobRequirementsProps {
  requirementsText: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const JobRequirements: React.FC<JobRequirementsProps> = ({
  requirementsText,
  handleChange,
}) => {
  return (
    <AccordionItem value="requirements">
      <AccordionTrigger className="py-4">Job Requirements</AccordionTrigger>
      <AccordionContent className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="requirementsText">Specific Requirements</Label>
          <Textarea
            id="requirementsText"
            name="requirementsText"
            value={requirementsText}
            onChange={handleChange}
            placeholder="List specific job requirements (each on a new line)..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter each requirement on a new line. For example: "Must be comfortable with night shifts"
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobRequirements;
