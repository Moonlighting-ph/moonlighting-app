
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoProps {
  contactEmail: string;
  phone: string;
  company?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ContactInfo({
  contactEmail,
  phone,
  company,
  handleChange
}: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          value={contactEmail}
          onChange={handleChange}
          placeholder="john.doe@example.com"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This is the email where employers will contact you
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={handleChange}
          placeholder="+639123456789"
        />
      </div>

      {company !== undefined && (
        <div className="space-y-2">
          <Label htmlFor="company">Current/Last Employer</Label>
          <Input
            id="company"
            name="company"
            value={company}
            onChange={handleChange}
            placeholder="e.g. Manila Medical Center"
          />
        </div>
      )}
    </div>
  );
}
