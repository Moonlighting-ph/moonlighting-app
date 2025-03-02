
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JobBenefitsProps {
  benefitsText: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const JobBenefits: React.FC<JobBenefitsProps> = ({
  benefitsText,
  handleChange,
}) => {
  return (
    <AccordionItem value="benefits">
      <AccordionTrigger className="py-4">Additional Benefits</AccordionTrigger>
      <AccordionContent className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="benefitsText">Benefits & Perks</Label>
          <Textarea
            id="benefitsText"
            name="benefitsText"
            value={benefitsText}
            onChange={handleChange}
            placeholder="List benefits and perks (each on a new line)..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter each benefit on a new line. For example: "Health insurance"
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobBenefits;
