
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface JobBasicInfoProps {
  title: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const JobBasicInfo: React.FC<JobBasicInfoProps> = ({
  title,
  location,
  type,
  deadline,
  description,
  handleChange,
  handleSelectChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title*</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Registered Nurse, ICU"
          value={title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location*</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g., Manila, Philippines"
          value={location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Job Type*</Label>
          <Select
            value={type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
              <SelectItem value="Locum">Locum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline*</Label>
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
        <Label htmlFor="description">Job Description*</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the job role and responsibilities..."
          value={description}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>
    </div>
  );
};

export default JobBasicInfo;
