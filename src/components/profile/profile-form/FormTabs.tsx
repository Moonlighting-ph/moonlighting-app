
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicProfileInfo } from "@/components/professional/profile/BasicProfileInfo";
import { MedicalProfessionalInfo } from "@/components/professional/profile/MedicalProfessionalInfo";
import { ContactInfo } from "@/components/professional/profile/ContactInfo";
import { DocumentVerification } from "../DocumentVerification";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";

type FormTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  submitDocuments: () => Promise<void>;
  userType?: string;
  isDocumentVerificationComplete: boolean;
};

export function FormTabs({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleSubmit,
  loading,
  submitDocuments,
  userType,
  isDocumentVerificationComplete
}: FormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <TabContentWrapper 
          handleSubmit={handleSubmit} 
          loading={loading}
          submitText="Save Basic Info"
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
      
      <TabsContent value="professional">
        <TabContentWrapper 
          handleSubmit={handleSubmit} 
          loading={loading}
          backAction={() => setActiveTab("basic")}
          submitText="Save Professional Info"
        >
          {userType === 'medical_professional' && (
            <MedicalProfessionalInfo
              prcLicense={formData.prc_license}
              workExperience={formData.work_experience}
              preferredLocation={formData.preferred_location}
              handleChange={handleChange}
            />
          )}
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="contact">
        <TabContentWrapper 
          handleSubmit={handleSubmit} 
          loading={loading}
          backAction={() => setActiveTab("professional")}
          submitText="Save Contact Info"
        >
          <ContactInfo
            contactEmail={formData.contact_email}
            phone={formData.phone}
            company={formData.company}
            handleChange={handleChange}
          />
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="verification">
        <div className="space-y-6 pt-4">
          <DocumentVerification
            prcLicense={formData.prc_license}
            tin={formData.tin_number}
            govId={formData.government_id}
            onPrcLicenseChange={(value) => formData.prc_license = value}
            onTinChange={(value) => formData.tin_number = value}
            onGovIdChange={(value) => formData.government_id = value}
            onSubmit={submitDocuments}
            isComplete={formData.document_verification_status === "verified"}
            status={formData.document_verification_status as "pending" | "submitted" | "verified" | "rejected"}
          />
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab("contact")}>
              Back
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading || !isDocumentVerificationComplete}
            >
              {loading ? "Saving..." : "Save All Profile"}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
