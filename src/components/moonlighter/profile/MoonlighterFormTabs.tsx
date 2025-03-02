
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentWrapper } from "@/components/profile/profile-form/TabContentWrapper";
import { BasicProfileInfo } from "@/components/moonlighter/profile/BasicProfileInfo";
import { ContactInfo } from "@/components/moonlighter/profile/ContactInfo";
import { MoonlighterInfo } from "@/components/moonlighter/profile/MoonlighterInfo";

interface MoonlighterFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitDocuments: () => Promise<void>;
  isDocumentVerificationComplete: boolean;
}

export function MoonlighterFormTabs({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleSelectChange = () => {},
  handleSubmit,
  loading,
  submitDocuments,
  isDocumentVerificationComplete,
}: MoonlighterFormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger 
          value="professional" 
          disabled={!formData.first_name || !formData.contact_email}
        >
          Professional Info
        </TabsTrigger>
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
          submitText="Next"
          disableSubmit={!formData.contact_email}
        >
          <ContactInfo 
            contactEmail={formData.contact_email}
            phone={formData.phone}
            handleChange={handleChange}
          />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="professional">
        <TabContentWrapper
          handleSubmit={handleSubmit}
          loading={loading}
          backAction={() => setActiveTab("contact")}
          submitText="Save"
          disableSubmit={false}
        >
          <MoonlighterInfo 
            prcLicense={formData.prc_license}
            workExperience={formData.work_experience}
            preferredLocation={formData.preferred_location}
            handleChange={handleChange}
          />
        </TabContentWrapper>
      </TabsContent>
    </Tabs>
  );
}
