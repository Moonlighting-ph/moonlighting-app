
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProfileHeaderProps = {
  completionPercentage: number;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ completionPercentage }) => {
  return (
    <>
      <CardTitle>Complete Your Profile</CardTitle>
      <CardDescription>
        Please add some additional information to complete your profile.
      </CardDescription>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Profile Completion</span>
          <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {completionPercentage < 100 
            ? `Complete your profile to apply for jobs (${Math.round(completionPercentage)}% completed)` 
            : "Your profile is complete. You can now apply for jobs!"}
        </p>
      </div>
    </>
  );
};
