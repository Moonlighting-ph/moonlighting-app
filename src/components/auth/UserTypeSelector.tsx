
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type UserType = 'provider' | 'moonlighter';

type UserTypeSelectorProps = {
  userType: UserType;
  onUserTypeChange: (value: UserType) => void;
  disabled?: boolean;
};

const UserTypeSelector = ({ userType, onUserTypeChange, disabled = false }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="userType">I am a:<span className="text-red-500 ml-1">*</span></Label>
      <RadioGroup
        value={userType}
        onValueChange={(value) => onUserTypeChange(value as UserType)}
        className="flex flex-col space-y-1"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="moonlighter" id="moonlighter" />
          <Label htmlFor="moonlighter" className={disabled ? "opacity-70" : ""}>
            Healthcare Professional (Moonlighter)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="provider" id="provider" />
          <Label htmlFor="provider" className={disabled ? "opacity-70" : ""}>
            Healthcare Provider (Hospital, Clinic, etc.)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
