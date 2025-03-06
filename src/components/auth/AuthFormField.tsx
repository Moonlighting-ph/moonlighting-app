
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthFormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const AuthFormField = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false 
}: AuthFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default AuthFormField;
