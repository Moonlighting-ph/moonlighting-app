
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MoonlighterProfileForm from '@/components/moonlighter/profile/MoonlighterProfileForm';
import DocumentVerificationManager from '@/components/moonlighter/profile/DocumentVerificationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { isMoonlighter } from '@/types/profile';

const MoonlighterProfile = () => {
  const { profile } = useAuth();
  
  // Redirect to appropriate dashboard if not a moonlighter
  if (profile && !isMoonlighter(profile)) {
    return <Navigate to="/platform" replace />;
  }
  
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Moonlighter Profile</h1>
        <p className="text-sm text-muted-foreground">
          Complete your profile to apply for healthcare moonlighting opportunities
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>
            Update your information and verify your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile Information
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center">
                <FileCheck className="h-4 w-4 mr-2" />
                Document Verification
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <MoonlighterProfileForm />
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentVerificationManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoonlighterProfile;
