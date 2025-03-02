
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentWrapper } from "./TabContentWrapper";
import BasicProfileInfo from "@/components/professional/profile/BasicProfileInfo";
import ContactInfo from "@/components/professional/profile/ContactInfo";
import MedicalProfessionalInfo from "@/components/professional/profile/MedicalProfessionalInfo";
import DocumentVerificationManager from "@/components/professional/profile/DocumentVerificationManager";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitDocuments: () => Promise<void>;
  userType?: string;
  isDocumentVerificationComplete: boolean;
  showDocumentVerification?: boolean;
}

export function FormTabs({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleSubmit,
  loading,
  submitDocuments,
  userType,
  isDocumentVerificationComplete,
  showDocumentVerification = true,
}: FormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        {showDocumentVerification && userType === "medical_professional" && (
          <TabsTrigger 
            value="verification" 
            disabled={!formData.first_name || !formData.contact_email}
          >
            Documents
          </TabsTrigger>
        )}
        {userType === "medical_provider" && (
          <TabsTrigger 
            value="provider" 
            disabled={!formData.first_name || !formData.contact_email}
          >
            Provider Info
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="basic">
        <TabContentWrapper
          title="Basic Information"
          description="Fill in your personal details to complete your profile"
          onSubmit={handleSubmit}
          loading={loading}
          nextTab="contact"
          setActiveTab={setActiveTab}
          isComplete={!!formData.first_name && !!formData.last_name}
        >
          <BasicProfileInfo formData={formData} onChange={handleChange} />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="contact">
        <TabContentWrapper
          title="Contact Information"
          description="How can healthcare providers reach you?"
          onSubmit={handleSubmit}
          loading={loading}
          previousTab="basic"
          nextTab={userType === "medical_professional" && showDocumentVerification ? "verification" : "provider"}
          setActiveTab={setActiveTab}
          isComplete={!!formData.contact_email}
        >
          <ContactInfo formData={formData} onChange={handleChange} />
        </TabContentWrapper>
      </TabsContent>

      {showDocumentVerification && userType === "medical_professional" && (
        <TabsContent value="verification">
          <DocumentVerificationManager />
        </TabsContent>
      )}

      {userType === "medical_provider" && (
        <TabsContent value="provider">
          <TabContentWrapper
            title="Healthcare Provider Information"
            description="Tell us more about your healthcare facility"
            onSubmit={handleSubmit}
            loading={loading}
            previousTab="contact"
            setActiveTab={setActiveTab}
            finalStep={true}
            isComplete={true}
          >
            <MedicalProfessionalInfo 
              formData={formData} 
              onChange={handleChange}
              isProvider={true}
            />
          </TabContentWrapper>
        </TabsContent>
      )}
    </Tabs>
  );
}
