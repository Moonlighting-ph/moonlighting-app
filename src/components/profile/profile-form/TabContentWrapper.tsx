
import React from 'react';
import { Button } from "@/components/ui/button";

type TabContentWrapperProps = {
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  backAction?: () => void;
  submitText: string;
  backText?: string;
  disableSubmit?: boolean;
};

export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({
  children,
  handleSubmit,
  loading,
  backAction,
  submitText,
  backText = "Back",
  disableSubmit = false
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {children}
      
      <div className="flex justify-between">
        {backAction ? (
          <Button type="button" variant="outline" onClick={backAction}>
            {backText}
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || disableSubmit}>
          {loading ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
};
