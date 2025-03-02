
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Check, AlertCircle, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const renderStatusAlert = () => {
    if (status === 'verified') {
      return (
        <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            Your documents have been verified successfully. You are now eligible to apply for healthcare jobs.
          </AlertDescription>
        </Alert>
      );
    } else if (status === 'submitted') {
      return (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Your documents have been submitted and are currently under review. This process typically takes 1-2 business days.
          </AlertDescription>
        </Alert>
      );
    } else if (status === 'rejected') {
      return (
        <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            Your document verification was not successful. Please review and update your information, then resubmit.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div>
      {renderStatusAlert()}
      
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
          <div className="space-y-2">
            <Label htmlFor="prc-license">PRC License Number</Label>
            <Input
              id="prc-license"
              placeholder="Enter your PRC license number"
              value={prcLicense}
              onChange={(e) => onPrcLicenseChange(e.target.value)}
              readOnly={isDisabled}
              className={isDisabled ? "bg-muted/50" : ""}
            />
            <p className="text-xs text-muted-foreground">
              This must match the license number on your PRC ID
            </p>
          </div>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Upload PRC ID Scan</p>
            <p className="text-xs text-muted-foreground text-center">
              Drag and drop your PRC ID scan here, or click to browse files
            </p>
            <Button variant="outline" size="sm" className="mt-2" disabled={isDisabled}>
              Upload File
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="tin" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="tin-number">TIN Number</Label>
            <Input
              id="tin-number"
              placeholder="Enter your TIN number"
              value={tin}
              onChange={(e) => onTinChange(e.target.value)}
              readOnly={isDisabled}
              className={isDisabled ? "bg-muted/50" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Your Taxpayer Identification Number is required for payment processing
            </p>
          </div>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Upload TIN Card/Certificate</p>
            <p className="text-xs text-muted-foreground text-center">
              Drag and drop your TIN document here, or click to browse files
            </p>
            <Button variant="outline" size="sm" className="mt-2" disabled={isDisabled}>
              Upload File
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="govid" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="gov-id-type">Government ID Type</Label>
            <Input
              id="gov-id-type"
              placeholder="e.g. Passport, Driver's License, UMID"
              value={govId}
              onChange={(e) => onGovIdChange(e.target.value)}
              readOnly={isDisabled}
              className={isDisabled ? "bg-muted/50" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Please specify which government ID you are submitting
            </p>
          </div>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Upload Government ID</p>
            <p className="text-xs text-muted-foreground text-center">
              Drag and drop your government ID here, or click to browse files
            </p>
            <Button variant="outline" size="sm" className="mt-2" disabled={isDisabled}>
              Upload File
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => {
            const tabs = ["prc", "tin", "govid"];
            const currentIndex = tabs.indexOf(activeTab);
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            setActiveTab(tabs[prevIndex]);
          }}
          disabled={activeTab === "prc" || isDisabled}
        >
          Previous
        </Button>

        {status === 'verified' ? (
          <Button variant="outline" className="text-green-600">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verified
          </Button>
        ) : status === 'submitted' ? (
          <Button variant="outline" className="text-blue-600">
            <Clock className="h-4 w-4 mr-2" />
            Under Review
          </Button>
        ) : status === 'rejected' ? (
          <Button onClick={handleSubmit} disabled={!isAllComplete || isSubmitting}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {isSubmitting ? "Resubmitting..." : "Resubmit"}
          </Button>
        ) : (
          <Button 
            onClick={() => {
              const tabs = ["prc", "tin", "govid"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex === tabs.length - 1 && isAllComplete) {
                handleSubmit();
              } else {
                const nextIndex = (currentIndex + 1) % tabs.length;
                setActiveTab(tabs[nextIndex]);
              }
            }}
            disabled={activeTab === "govid" && (!isAllComplete || isSubmitting)}
          >
            {activeTab === "govid" ? (isSubmitting ? "Submitting..." : "Submit All") : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
