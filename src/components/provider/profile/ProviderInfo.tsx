
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProviderInfoProps {
  company: string;
  companyAddress: string;
  facilityType: string;
  prcLicense?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const ProviderInfo: React.FC<ProviderInfoProps> = ({
  company,
  companyAddress,
  facilityType,
  prcLicense = '',
  handleChange,
  handleSelectChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Provider Information</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="company">Facility/Provider Name</Label>
          <Input
            id="company"
            name="company"
            value={company}
            onChange={handleChange}
            placeholder="Enter your facility or provider name"
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
        
        <div>
          <Label htmlFor="prc_license">License/Registration Number</Label>
          <Input
            id="prc_license"
            name="prc_license"
            value={prcLicense}
            onChange={handleChange}
            placeholder="Enter facility license or registration number"
            className="mt-1"
          />
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
      </div>
    </div>
  );
};
