
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/profile-form/ProfileHeader";
import { MoonlighterFormTabs } from "./MoonlighterFormTabs";
import { useProfileForm } from "@/hooks/useProfileForm";

const MoonlighterProfileForm = () => {
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ProfileHeader completionPercentage={calculateCompletionPercentage} />
      </CardHeader>
      <CardContent>
        <MoonlighterFormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          loading={loading}
          submitDocuments={submitDocuments}
          isDocumentVerificationComplete={isDocumentVerificationComplete}
        />
      </CardContent>
    </Card>
  );
};

export default MoonlighterProfileForm;
