
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MedicalProfessionalInfoProps = {
  prcLicense: string;
  workExperience: string;
  preferredLocation: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function MedicalProfessionalInfo({
  prcLicense,
  workExperience,
  preferredLocation,
  handleChange,
}: MedicalProfessionalInfoProps) {
  return (
    <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/50 rounded-md">
      <h3 className="font-medium text-blue-800">Medical Professional Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="prc_license">PRC License Number</Label>
        <Input
          id="prc_license"
          name="prc_license"
          placeholder="Enter your license number"
          value={prcLicense}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="work_experience">Work Experience</Label>
        <Textarea
          id="work_experience"
          name="work_experience"
          placeholder="Describe your clinical experience, specialties, and years of practice"
          className="min-h-[100px]"
          value={workExperience}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preferred_location">Preferred Work Location</Label>
        <Input
          id="preferred_location"
          name="preferred_location"
          placeholder="e.g. Manila, Metro Manila, Philippines"
          value={preferredLocation}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
