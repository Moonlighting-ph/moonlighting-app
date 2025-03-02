
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";

type StatusAlertProps = {
  status?: 'pending' | 'submitted' | 'verified' | 'rejected';
};

export const StatusAlert: React.FC<StatusAlertProps> = ({ status }) => {
  if (status === 'verified') {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-700 dark:text-green-400">
          Your documents have been verified successfully. You are now eligible to apply for healthcare jobs.
        </AlertDescription>
      </Alert>
    );
  } else if (status === 'submitted') {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          Your documents have been submitted and are currently under review. This process typically takes 1-2 business days.
        </AlertDescription>
      </Alert>
    );
  } else if (status === 'rejected') {
    return (
      <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 dark:text-red-400">
          Your document verification was not successful. Please review and update your information, then resubmit.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
