
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VerificationTab } from './document-verification/VerificationTab';
import { StatusAlert } from './document-verification/StatusAlert';
import { StatusButton } from './document-verification/StatusButton';
import { NavigationButtons } from './document-verification/NavigationButtons';

type DocumentVerificationProps = {
  prcLicense: string;
  tin: string;
  govId: string;
  onPrcLicenseChange: (value: string) => void;
  onTinChange: (value: string) => void;
  onGovIdChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isComplete: boolean;
  status?: 'pending' | 'submitted' | 'verified' | 'rejected';
};

export function DocumentVerification({
  prcLicense,
  tin,
  govId,
  onPrcLicenseChange,
  onTinChange,
  onGovIdChange,
  onSubmit,
  isComplete,
  status = 'pending'
}: DocumentVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("prc");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      toast({
        title: "Verification documents submitted",
        description: "Your documents have been submitted for verification",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your documents",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPrcComplete = prcLicense.trim().length > 0;
  const isTinComplete = tin.trim().length > 0;
  const isGovIdComplete = govId.trim().length > 0;
  const isAllComplete = isPrcComplete && isTinComplete && isGovIdComplete;
  
  const isDisabled = status === 'verified' || status === 'submitted';

  return (
    <div>
      <StatusAlert status={status} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prc" className="relative" disabled={isDisabled}>
            PRC License
            {isPrcComplete && <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="tin" className="relative" disabled={isDisabled}>
            TIN
            {isTinComplete && <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="govid" className="relative" disabled={isDisabled}>
            Gov't ID
            {isGovIdComplete && <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prc" className="space-y-4 mt-4">
          <VerificationTab
            label="PRC License Number"
            placeholder="Enter your PRC license number"
            description="This must match the license number on your PRC ID"
            value={prcLicense}
            onChange={onPrcLicenseChange}
            uploadTitle="Upload PRC ID Scan"
            uploadDescription="Drag and drop your PRC ID scan here, or click to browse files"
            isDisabled={isDisabled}
          />
        </TabsContent>
        
        <TabsContent value="tin" className="space-y-4 mt-4">
          <VerificationTab
            label="TIN Number"
            placeholder="Enter your TIN number"
            description="Your Taxpayer Identification Number is required for payment processing"
            value={tin}
            onChange={onTinChange}
            uploadTitle="Upload TIN Card/Certificate"
            uploadDescription="Drag and drop your TIN document here, or click to browse files"
            isDisabled={isDisabled}
          />
        </TabsContent>
        
        <TabsContent value="govid" className="space-y-4 mt-4">
          <VerificationTab
            label="Government ID Type"
            placeholder="e.g. Passport, Driver's License, UMID"
            description="Please specify which government ID you are submitting"
            value={govId}
            onChange={onGovIdChange}
            uploadTitle="Upload Government ID"
            uploadDescription="Drag and drop your government ID here, or click to browse files"
            isDisabled={isDisabled}
          />
        </TabsContent>
      </Tabs>

      <NavigationButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
        isAllComplete={isAllComplete}
        isSubmitting={isSubmitting}
        status={status}
      />
    </div>
  );
}
