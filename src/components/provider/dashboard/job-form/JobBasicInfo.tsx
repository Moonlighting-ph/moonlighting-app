
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface JobBasicInfoProps {
  title: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const JobBasicInfo: React.FC<JobBasicInfoProps> = ({
  title,
  location,
  type,
  deadline,
  description,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={title} 
          onChange={handleChange} 
          placeholder="e.g. Registered Nurse" 
          required 
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            name="location" 
            value={location} 
            onChange={handleChange} 
            placeholder="e.g. Manila, Philippines" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Employment Type</Label>
          <Select
            value={type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input 
            id="deadline" 
            name="deadline" 
            type="date" 
            value={deadline} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={description} 
          onChange={handleChange} 
          placeholder="Describe the role responsibilities, department, and work environment..." 
          required 
          rows={6}
        />
      </div>
    </div>
  );
};

export default JobBasicInfo;
