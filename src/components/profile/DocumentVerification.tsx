
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocumentVerificationProps = {
  prcLicense: string;
  tin: string;
  govId: string;
  onPrcLicenseChange: (value: string) => void;
  onTinChange: (value: string) => void;
  onGovIdChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isComplete: boolean;
};

export function DocumentVerification({
  prcLicense,
  tin,
  govId,
  onPrcLicenseChange,
  onTinChange,
  onGovIdChange,
  onSubmit,
  isComplete
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Document Verification
          {isComplete ? (
            <span className="inline-flex items-center text-sm font-medium text-green-500">
              <Check className="mr-1 h-4 w-4" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center text-sm font-medium text-amber-500">
              <AlertCircle className="mr-1 h-4 w-4" /> Pending
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Please submit the following documents for verification. These are required to apply for jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prc" className="relative">
              PRC License
              {isPrcComplete && <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="tin" className="relative">
              TIN
              {isTinComplete && <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="govid" className="relative">
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
              <Button variant="outline" size="sm" className="mt-2">
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
              <Button variant="outline" size="sm" className="mt-2">
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
              <Button variant="outline" size="sm" className="mt-2">
                Upload File
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            const tabs = ["prc", "tin", "govid"];
            const currentIndex = tabs.indexOf(activeTab);
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            setActiveTab(tabs[prevIndex]);
          }}
          disabled={activeTab === "prc"}
        >
          Previous
        </Button>
        <Button 
          onClick={() => {
            const tabs = ["prc", "tin", "govid"];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex === tabs.length - 1) {
              handleSubmit();
            } else {
              const nextIndex = (currentIndex + 1) % tabs.length;
              setActiveTab(tabs[nextIndex]);
            }
          }}
          disabled={isSubmitting}
        >
          {activeTab === "govid" ? (isSubmitting ? "Submitting..." : "Submit All") : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
