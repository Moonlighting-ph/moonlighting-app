
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MedicalProfessionalInfoProps {
  prcLicense: string;
  workExperience: string;
  preferredLocation: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function MedicalProfessionalInfo({
  prcLicense,
  workExperience,
  preferredLocation,
  handleChange
}: MedicalProfessionalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium">Medical Professional Information</h2>
        <p className="text-sm text-muted-foreground">
          This information is required for medical professionals to apply for healthcare positions
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prc_license">PRC License Number</Label>
        <Input
          id="prc_license"
          name="prc_license"
          value={prcLicense}
          onChange={handleChange}
          placeholder="Enter your PRC license number"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Your Professional Regulation Commission license is required for verification
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="work_experience">Years of Experience</Label>
        <Input
          id="work_experience"
          name="work_experience"
          value={workExperience}
          onChange={handleChange}
          placeholder="e.g. 5 years"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_location">Preferred Location</Label>
        <Input
          id="preferred_location"
          name="preferred_location"
          value={preferredLocation}
          onChange={handleChange}
          placeholder="e.g. Metro Manila, Cebu"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter your preferred work locations, separated by commas
        </p>
      </div>
    </div>
  );
}
