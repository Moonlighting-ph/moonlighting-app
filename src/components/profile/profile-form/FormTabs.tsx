
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentWrapper } from "./TabContentWrapper";
import { BasicProfileInfo } from "@/components/professional/profile/BasicProfileInfo";
import { ContactInfo } from "@/components/professional/profile/ContactInfo";
import { MedicalProfessionalInfo } from "@/components/professional/profile/MedicalProfessionalInfo";
import DocumentVerificationManager from "@/components/professional/profile/DocumentVerificationManager";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
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
  handleSelectChange,
  handleSubmit,
  loading,
  submitDocuments,
  userType,
  isDocumentVerificationComplete,
  showDocumentVerification = true,
}: FormTabsProps) {
  const isMedicalProfessional = userType === "medical_professional";
  const isMedicalProvider = userType === "medical_provider";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        {showDocumentVerification && isMedicalProfessional && (
          <TabsTrigger 
            value="verification" 
            disabled={!formData.first_name || !formData.contact_email}
          >
            Documents
          </TabsTrigger>
        )}
        {(isMedicalProfessional || isMedicalProvider) && (
          <TabsTrigger 
            value="professional" 
            disabled={!formData.first_name || !formData.contact_email}
          >
            {isMedicalProfessional ? 'Professional Info' : 'Provider Info'}
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="basic">
        <TabContentWrapper
          handleSubmit={handleSubmit}
          loading={loading}
          backAction={undefined}
          submitText="Next"
          disableSubmit={!formData.first_name || !formData.last_name}
        >
          <BasicProfileInfo 
            firstName={formData.first_name}
            lastName={formData.last_name}
            title={formData.title}
            bio={formData.bio}
            avatarUrl={formData.avatar_url}
            handleChange={handleChange}
          />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="contact">
        <TabContentWrapper
          handleSubmit={handleSubmit}
          loading={loading}
          backAction={() => setActiveTab("basic")}
          submitText={(isMedicalProfessional && showDocumentVerification) || isMedicalProvider ? "Next" : "Save"}
          disableSubmit={!formData.contact_email}
        >
          <ContactInfo 
            contactEmail={formData.contact_email}
            phone={formData.phone}
            company={formData.company}
            handleChange={handleChange}
          />
        </TabContentWrapper>
      </TabsContent>

      {showDocumentVerification && isMedicalProfessional && (
        <TabsContent value="verification">
          <DocumentVerificationManager />
        </TabsContent>
      )}

      <TabsContent value="professional">
        <TabContentWrapper
          handleSubmit={handleSubmit}
          loading={loading}
          backAction={() => setActiveTab("contact")}
          submitText="Save"
          disableSubmit={false}
        >
          <MedicalProfessionalInfo 
            prcLicense={formData.prc_license}
            workExperience={formData.work_experience}
            preferredLocation={formData.preferred_location}
            companyName={formData.company}
            companyAddress={formData.company_address}
            facilityType={formData.facility_type}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            userType={userType}
          />
        </TabContentWrapper>
      </TabsContent>
    </Tabs>
  );
}
