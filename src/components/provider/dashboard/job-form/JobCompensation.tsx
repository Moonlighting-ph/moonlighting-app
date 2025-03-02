
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface JobCompensationProps {
  salary: string;
  baseSalary: string;
  benefitsValue: string;
  paymentFrequency: string;
  bonusStructure: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const JobCompensation: React.FC<JobCompensationProps> = ({
  salary,
  baseSalary,
  benefitsValue,
  paymentFrequency,
  bonusStructure,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <AccordionItem value="compensation">
      <AccordionTrigger className="py-4">Compensation & Benefits</AccordionTrigger>
      <AccordionContent className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salary Range (visible to applicants)</Label>
          <Input
            id="salary"
            name="salary"
            value={salary}
            onChange={handleChange}
            placeholder="e.g. ₱30,000 - ₱40,000 per month"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Base Salary</Label>
            <Input
              id="baseSalary"
              name="baseSalary"
              value={baseSalary}
              onChange={handleChange}
              placeholder="e.g. ₱35,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefitsValue">Benefits Value</Label>
            <Input
              id="benefitsValue"
              name="benefitsValue"
              value={benefitsValue}
              onChange={handleChange}
              placeholder="e.g. ₱5,000"
            />
            <p className="text-xs text-muted-foreground">
              Estimated monetary value of benefits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select
              value={paymentFrequency}
              onValueChange={(value) => handleSelectChange('paymentFrequency', value)}
            >
              <SelectTrigger id="paymentFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonusStructure">Bonus Structure</Label>
            <Textarea
              id="bonusStructure"
              name="bonusStructure"
              value={bonusStructure}
              onChange={handleChange}
              placeholder="e.g. Performance bonus of up to 10% annually"
              className="h-[80px]"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobCompensation;
