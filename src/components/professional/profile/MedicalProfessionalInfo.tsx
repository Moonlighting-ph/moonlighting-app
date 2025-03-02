
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicalProfessionalInfoProps {
  prcLicense: string;
  workExperience: string;
  preferredLocation: string;
  userType?: string;
  company?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
}

export function MedicalProfessionalInfo({
  prcLicense,
  workExperience,
  preferredLocation,
  userType = 'medical_professional',
  company = '',
  handleChange,
  handleSelectChange
}: MedicalProfessionalInfoProps) {
  const isMedicalProfessional = userType === 'medical_professional';
  const isProvider = userType === 'hospital_provider' || userType === 'medical_provider';
  
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium">
          {isMedicalProfessional 
            ? "Medical Professional Information" 
            : "Healthcare Provider Information"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isMedicalProfessional 
            ? "This information is required for medical professionals to apply for healthcare positions"
            : "This information is required for healthcare providers to post job openings"}
        </p>
      </div>
      
      {isMedicalProfessional && (
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
      )}

      {isProvider && (
        <div className="space-y-2">
          <Label htmlFor="company">Healthcare Institution/Company</Label>
          <Input
            id="company"
            name="company"
            value={company}
            onChange={handleChange}
            placeholder="Enter your hospital or healthcare institution name"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="work_experience">
          {isMedicalProfessional ? "Years of Experience" : "Years in Operation"}
        </Label>
        <Input
          id="work_experience"
          name="work_experience"
          value={workExperience}
          onChange={handleChange}
          placeholder={isMedicalProfessional ? "e.g. 5 years" : "e.g. 20 years"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_location">
          {isMedicalProfessional ? "Preferred Location" : "Service Area"}
        </Label>
        <Input
          id="preferred_location"
          name="preferred_location"
          value={preferredLocation}
          onChange={handleChange}
          placeholder="e.g. Metro Manila, Cebu"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {isMedicalProfessional 
            ? "Enter your preferred work locations, separated by commas" 
            : "Enter the areas where your institution operates, separated by commas"}
        </p>
      </div>
    </div>
  );
}
