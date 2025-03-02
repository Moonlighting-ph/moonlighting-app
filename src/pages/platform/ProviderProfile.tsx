
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderProfileForm from '@/components/provider/profile/ProviderProfileForm';
import { Building2, CircleDollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { isProvider } from '@/types/profile';

const ProviderProfile = () => {
  const { profile } = useAuth();
  
  // Redirect to appropriate dashboard if not a provider
  if (profile && !isProvider(profile)) {
    return <Navigate to="/platform" replace />;
  }
  
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Healthcare Provider Profile</h1>
        <p className="text-sm text-muted-foreground">
          Complete your provider profile to attract qualified healthcare professionals
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
          <CardDescription>
            Update your facility details to help moonlighters find you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderProfileForm />
        </CardContent>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-500" />
              Facility Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Completing your provider profile increases your visibility to healthcare professionals 
              looking for moonlighting opportunities.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5 text-green-500" />
              Post Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              After completing your profile, you can post job opportunities for healthcare 
              professionals to apply to.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderProfile;
