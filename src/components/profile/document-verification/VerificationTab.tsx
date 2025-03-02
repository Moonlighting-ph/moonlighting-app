
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type VerificationTabProps = {
  label: string;
  placeholder: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  uploadTitle: string;
  uploadDescription: string;
  isDisabled: boolean;
};

export const VerificationTab: React.FC<VerificationTabProps> = ({
  label,
  placeholder,
  description,
  value,
  onChange,
  uploadTitle,
  uploadDescription,
  isDisabled
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isDisabled}
          className={isDisabled ? "bg-muted/50" : ""}
        />
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">{uploadTitle}</p>
        <p className="text-xs text-muted-foreground text-center">
          {uploadDescription}
        </p>
        <Button variant="outline" size="sm" className="mt-2" disabled={isDisabled}>
          Upload File
        </Button>
      </div>
    </div>
  );
};
