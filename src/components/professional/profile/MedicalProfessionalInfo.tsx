
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MedicalProfessionalInfoProps {
  prcLicense: string;
  workExperience: string;
  preferredLocation: string;
  companyName?: string;
  companyAddress?: string;
  facilityType?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  userType?: string;
}

export const MedicalProfessionalInfo: React.FC<MedicalProfessionalInfoProps> = ({
  prcLicense,
  workExperience,
  preferredLocation,
  companyName = '',
  companyAddress = '',
  facilityType = '',
  handleChange,
  handleSelectChange = () => {},
  userType = 'medical_professional'
}) => {
  const isMedicalProfessional = userType === 'medical_professional';
  const isMedicalProvider = userType === 'medical_provider';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {isMedicalProfessional ? 'Professional Information' : 'Provider Information'}
      </h3>
      
      {/* License Info - Common for both but labeled differently */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="prc_license">
            {isMedicalProfessional ? 'PRC License Number' : 'Provider License/Registration Number'}
          </Label>
          <Input
            id="prc_license"
            name="prc_license"
            value={prcLicense}
            onChange={handleChange}
            placeholder={isMedicalProfessional ? "Enter your PRC license number" : "Enter provider license/registration number"}
            className="mt-1"
          />
        </div>
        
        {/* Conditional fields based on user type */}
        {isMedicalProfessional && (
          <>
            <div>
              <Label htmlFor="work_experience">Years of Experience</Label>
              <Input
                id="work_experience"
                name="work_experience"
                value={workExperience}
                onChange={handleChange}
                placeholder="Enter your years of experience"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="preferred_location">Preferred Work Location</Label>
              <Input
                id="preferred_location"
                name="preferred_location"
                value={preferredLocation}
                onChange={handleChange}
                placeholder="Enter your preferred work location"
                className="mt-1"
              />
            </div>
            
            <div className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    As a healthcare professional, completing your profile helps hospitals and clinics find you for available moonlighting opportunities that match your skills and preferences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {isMedicalProvider && (
          <>
            <div>
              <Label htmlFor="company">Facility/Hospital Name</Label>
              <Input
                id="company"
                name="company"
                value={companyName}
                onChange={handleChange}
                placeholder="Enter your facility or hospital name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="company_address">Facility Address</Label>
              <Textarea
                id="company_address"
                name="company_address"
                value={companyAddress}
                onChange={handleChange}
                placeholder="Enter your facility address"
                className="mt-1 min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="facility_type">Facility Type</Label>
              <Select 
                value={facilityType} 
                onValueChange={(value) => handleSelectChange('facility_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic Center</SelectItem>
                  <SelectItem value="rehabilitation">Rehabilitation Center</SelectItem>
                  <SelectItem value="specialty">Specialty Center</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    As a healthcare provider, completing your profile information helps qualified medical professionals find job opportunities at your facility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
