
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactInfoProps = {
  contactEmail: string;
  phone: string;
  company: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function ContactInfo({
  contactEmail,
  phone,
  company,
  handleChange,
}: ContactInfoProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            value={contactEmail}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Hospital/Company</Label>
        <Input
          id="company"
          name="company"
          placeholder="Where do you work?"
          value={company}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
