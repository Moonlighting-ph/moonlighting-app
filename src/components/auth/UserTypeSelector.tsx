
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type UserType = 'provider' | 'moonlighter';

type UserTypeSelectorProps = {
  userType: UserType;
  onUserTypeChange: (value: UserType) => void;
};

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="userType">I am a:</Label>
      <RadioGroup
        value={userType}
        onValueChange={(value) => onUserTypeChange(value as UserType)}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="moonlighter" id="moonlighter" />
          <Label htmlFor="moonlighter">Healthcare Professional (Moonlighter)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="provider" id="provider" />
          <Label htmlFor="provider">Healthcare Provider</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
