
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface JobUrgencyToggleProps {
  urgent: boolean;
  handleSwitchChange: (checked: boolean) => void;
}

const JobUrgencyToggle: React.FC<JobUrgencyToggleProps> = ({
  urgent,
  handleSwitchChange,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor="urgent-toggle" className="text-base">Urgent Hiring</Label>
        <p className="text-sm text-muted-foreground">
          Mark this position as urgent to increase visibility
        </p>
      </div>
      <Switch
        id="urgent-toggle"
        checked={urgent}
        onCheckedChange={handleSwitchChange}
      />
    </div>
  );
};

export default JobUrgencyToggle;
