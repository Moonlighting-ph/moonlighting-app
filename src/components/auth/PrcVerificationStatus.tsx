
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrcVerificationStatusProps {
  userId: string;
  onStartVerification?: () => void;
}

const PrcVerificationStatus: React.FC<PrcVerificationStatusProps> = ({ userId, onStartVerification }) => {
  const { data: license, isLoading, isError, refetch } = useQuery({
    queryKey: ['prc-license', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-pulse text-muted-foreground" />
            <p>Checking license status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          We couldn't retrieve your license information. Please try again.
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!license) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
            PRC License Verification
          </CardTitle>
          <CardDescription>
            Healthcare professionals need to verify their PRC license before accessing certain features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onStartVerification ? (
            <Button 
              onClick={onStartVerification} 
              className="w-full"
            >
              Start Verification
            </Button>
          ) : (
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Verification Required</AlertTitle>
              <AlertDescription>
                Please verify your PRC license to access all features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  const renderStatus = () => {
    switch (license.status) {
      case 'verified':
        return (
          <Alert className="bg-green-50 border-green-200">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your PRC License has been verified. You have full access to all features.
            </AlertDescription>
          </Alert>
        );
      case 'pending':
        return (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Pending Verification</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your license verification is in progress. This process typically takes 24-48 hours.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              Your license verification was unsuccessful. Please submit an appeal with additional documentation.
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Submit Appeal
              </Button>
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Unknown Status</AlertTitle>
            <AlertDescription>
              Your license status is unknown. Please contact support.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          PRC License Status
        </CardTitle>
        <CardDescription>
          License Number: {license.license_number}
          <br />
          Profession: {license.profession}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatus()}
      </CardContent>
    </Card>
  );
};

export default PrcVerificationStatus;
