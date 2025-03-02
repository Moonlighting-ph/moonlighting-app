
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface JobUrgencyToggleProps {
  urgent: boolean;
  handleSwitchChange: (checked: boolean) => void;
}

const JobUrgencyToggle: React.FC<JobUrgencyToggleProps> = ({ urgent, handleSwitchChange }) => {
  return (
    <div className="flex items-center space-x-2 pt-4">
      <Tag className="h-5 w-5 text-destructive" />
      <Label htmlFor="urgent" className="cursor-pointer font-medium">Mark as Urgent</Label>
      <Switch
        id="urgent"
        checked={urgent}
        onCheckedChange={handleSwitchChange}
      />
      {urgent && (
        <Badge variant="destructive">Urgent</Badge>
      )}
    </div>
  );
};

export default JobUrgencyToggle;
