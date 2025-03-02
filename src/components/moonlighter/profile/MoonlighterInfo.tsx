
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface MoonlighterInfoProps {
  prcLicense: string;
  workExperience: string;
  preferredLocation: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MoonlighterInfo: React.FC<MoonlighterInfoProps> = ({
  prcLicense,
  workExperience,
  preferredLocation,
  handleChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Professional Information</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="prc_license">PRC License Number</Label>
          <Input
            id="prc_license"
            name="prc_license"
            value={prcLicense}
            onChange={handleChange}
            placeholder="Enter your PRC license number"
            className="mt-1"
          />
        </div>
        
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
      </div>
    </div>
  );
};
