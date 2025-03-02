
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

type StatusButtonProps = {
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  onClick: () => Promise<void>;
  isAllComplete: boolean;
  isSubmitting: boolean;
};

export const StatusButton: React.FC<StatusButtonProps> = ({ 
  status, 
  onClick, 
  isAllComplete, 
  isSubmitting 
}) => {
  if (status === 'verified') {
    return (
      <Button variant="outline" className="text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Verified
      </Button>
    );
  } else if (status === 'submitted') {
    return (
      <Button variant="outline" className="text-blue-600">
        <Clock className="h-4 w-4 mr-2" />
        Under Review
      </Button>
    );
  } else if (status === 'rejected') {
    return (
      <Button onClick={onClick} disabled={!isAllComplete || isSubmitting}>
        <RefreshCw className="h-4 w-4 mr-2" />
        {isSubmitting ? "Resubmitting..." : "Resubmit"}
      </Button>
    );
  }
  
  // For pending status
  return null;
};
