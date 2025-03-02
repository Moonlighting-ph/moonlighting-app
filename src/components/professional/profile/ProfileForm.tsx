
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/profile-form/ProfileHeader";
import { FormTabs } from "@/components/profile/profile-form/FormTabs";
import { useProfileForm } from "@/hooks/useProfileForm";

export default function ProfileForm() {
  const { 
    formData, 
    activeTab, 
    loading, 
    profile,
    handleChange,
    handleSelectChange, 
    handleSubmit, 
    submitDocuments, 
    setActiveTab,
    calculateCompletionPercentage,
    isDocumentVerificationComplete
  } = useProfileForm();

  // Don't show document verification for medical providers
  const showDocumentVerification = profile?.user_type === 'medical_professional';

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ProfileHeader completionPercentage={calculateCompletionPercentage} />
      </CardHeader>
      <CardContent>
        <FormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          loading={loading}
          submitDocuments={submitDocuments}
          userType={profile?.user_type}
          isDocumentVerificationComplete={isDocumentVerificationComplete}
          showDocumentVerification={showDocumentVerification}
        />
      </CardContent>
    </Card>
  );
}
