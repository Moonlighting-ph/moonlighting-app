
import React from 'react';
import { Button } from "@/components/ui/button";

type NavigationButtonsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: () => Promise<void>;
  isDisabled: boolean;
  isAllComplete: boolean;
  isSubmitting: boolean;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
};

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  activeTab, 
  setActiveTab, 
  handleSubmit, 
  isDisabled, 
  isAllComplete,
  isSubmitting,
  status
}) => {
  const tabs = ["prc", "tin", "govid"];
  const currentIndex = tabs.indexOf(activeTab);
  
  const handleNext = () => {
    if (currentIndex === tabs.length - 1 && isAllComplete) {
      handleSubmit();
    } else {
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIndex]);
  };

  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={handlePrevious}
        disabled={activeTab === "prc" || isDisabled}
      >
        Previous
      </Button>

      {status === 'verified' || status === 'submitted' || status === 'rejected' ? (
        <Button variant="outline" disabled={true}>
          {status === 'verified' ? "Verified" : status === 'submitted' ? "Under Review" : "Rejected"}
        </Button>
      ) : (
        <Button 
          onClick={handleNext}
          disabled={activeTab === "govid" && (!isAllComplete || isSubmitting)}
        >
          {activeTab === "govid" ? (isSubmitting ? "Submitting..." : "Submit All") : "Next"}
        </Button>
      )}
    </div>
  );
};
