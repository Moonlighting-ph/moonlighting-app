
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";

interface JobUrgencyToggleProps {
  urgent: boolean;
  handleSwitchChange: (checked: boolean) => void;
}

const JobUrgencyToggle: React.FC<JobUrgencyToggleProps> = ({
  urgent,
  handleSwitchChange,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
      <div className="space-y-0.5">
        <div className="flex items-center">
          <Label htmlFor="urgent-toggle" className="text-base font-medium">Urgent Hiring</Label>
          {urgent && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <AlertCircle className="h-3 w-3 mr-1" />
              Urgent
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Mark this position as urgent to increase visibility and attract qualified candidates faster
        </p>
      </div>
      <Switch
        id="urgent-toggle"
        checked={urgent}
        onCheckedChange={handleSwitchChange}
        className={urgent ? "data-[state=checked]:bg-red-500" : ""}
      />
    </div>
  );
};

export default JobUrgencyToggle;
