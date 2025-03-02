
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/profile-form/ProfileHeader";
import { ProviderFormTabs } from "./ProviderFormTabs";
import { useProfileForm } from "@/hooks/useProfileForm";

const ProviderProfileForm = () => {
  const { 
    formData, 
    activeTab, 
    loading, 
    profile,
    handleChange,
    handleSelectChange, 
    handleSubmit,
    setActiveTab,
    calculateCompletionPercentage
  } = useProfileForm();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ProfileHeader completionPercentage={calculateCompletionPercentage} />
      </CardHeader>
      <CardContent>
        <ProviderFormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ProviderProfileForm;
