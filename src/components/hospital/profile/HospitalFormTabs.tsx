
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentWrapper } from "@/components/profile/profile-form/TabContentWrapper";
import { BasicProfileInfo } from "@/components/hospital/profile/BasicProfileInfo";
import { ContactInfo } from "@/components/hospital/profile/ContactInfo";
import { HospitalInfo } from "@/components/hospital/profile/HospitalInfo";

interface HospitalFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function HospitalFormTabs({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleSelectChange = () => {},
  handleSubmit,
  loading
}: HospitalFormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger 
          value="facility" 
          disabled={!formData.first_name || !formData.contact_email}
        >
          Facility Info
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

      <TabsContent value="facility">
        <TabContentWrapper
          handleSubmit={handleSubmit}
          loading={loading}
          backAction={() => setActiveTab("contact")}
          submitText="Save"
          disableSubmit={false}
        >
          <HospitalInfo 
            company={formData.company}
            companyAddress={formData.company_address}
            facilityType={formData.facility_type}
            prcLicense={formData.prc_license}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        </TabContentWrapper>
      </TabsContent>
    </Tabs>
  );
}
