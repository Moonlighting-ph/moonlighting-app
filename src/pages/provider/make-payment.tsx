
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPaymentMethods } from '@/services/paymentMethodService';
import { getUserProfile } from '@/services/profileService';
import { UserProfile } from '@/types/profile';
import { getApplicationForMoonlighter } from '@/services/jobApplicationService';
import { PaymentMethod } from '@/types/payment';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const MakePayment: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { jobId, moonlighterId } = useParams<{ jobId: string; moonlighterId: string }>();
  
  const [moonlighterProfile, setMoonlighterProfile] = useState<UserProfile | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!session?.user) {
      navigate('/auth/login');
      return;
    }
    
    if (!jobId || !moonlighterId) {
      toast.error('Missing required information');
      navigate('/provider');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the moonlighter's profile
        const profile = await getUserProfile(moonlighterId);
        if (!profile) {
          toast.error('Could not find healthcare professional');
          navigate('/provider');
          return;
        }
        setMoonlighterProfile(profile);
        
        // Fetch the moonlighter's payment methods
        const methods = await fetchPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
        
        // Get the application ID
        const application = await getApplicationForMoonlighter(jobId, moonlighterId);
        if (application) {
          setApplicationId(application.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, jobId, moonlighterId, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Make Payment</h1>
          <div className="text-center py-12">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/provider/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Make Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Submit a payment to {moonlighterProfile?.first_name} {moonlighterProfile?.last_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManualPaymentForm
                  providerId={session?.user?.id || ''}
                  moonlighterId={moonlighterId || ''}
                  jobId={jobId || ''}
                  applicationId={applicationId}
                  paymentMethods={paymentMethods}
                  onComplete={() => navigate('/provider/payments')}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {moonlighterProfile?.first_name} {moonlighterProfile?.last_name}</p>
                  {moonlighterProfile?.specialization && (
                    <p><strong>Specialization:</strong> {moonlighterProfile.specialization}</p>
                  )}
                  <p><strong>Email:</strong> {moonlighterProfile?.email}</p>
                  {moonlighterProfile?.phone && (
                    <p><strong>Phone:</strong> {moonlighterProfile.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MakePayment;
