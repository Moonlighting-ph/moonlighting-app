
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "./profile-form/ProfileHeader";
import { FormTabs } from "./profile-form/FormTabs";
import { useProfileForm } from "@/hooks/useProfileForm";

export default function ProfileForm() {
  const { 
    formData, 
    activeTab, 
    loading, 
    profile,
    handleChange, 
    handleSubmit, 
    submitDocuments, 
    setActiveTab,
    calculateCompletionPercentage,
    isDocumentVerificationComplete
  } = useProfileForm();

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
          handleSubmit={handleSubmit}
          loading={loading}
          submitDocuments={submitDocuments}
          userType={profile?.user_type}
          isDocumentVerificationComplete={isDocumentVerificationComplete}
        />
      </CardContent>
    </Card>
  );
}
