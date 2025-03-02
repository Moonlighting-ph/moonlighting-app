import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { BasicProfileInfo } from "./BasicProfileInfo";
import { MedicalProfessionalInfo } from "./MedicalProfessionalInfo";
import { ContactInfo } from "./ContactInfo";
import { DocumentVerification } from "./DocumentVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./profile-form/ProfileHeader";
import { TabContentWrapper } from "./profile-form/TabContentWrapper";
import { Profile } from "@/types/profile";

type ProfileFormData = {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  contact_email: string;
  phone: string;
  company: string;
  avatar_url: string;
  prc_license: string;
  work_experience: string;
  preferred_location: string;
  tin_number: string;
  government_id: string;
  document_verification_status: string;
};

export default function ProfileForm() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    title: "",
    bio: "",
    contact_email: "",
    phone: "",
    company: "",
    avatar_url: "",
    prc_license: "",
    work_experience: "",
    preferred_location: "",
    tin_number: "",
    government_id: "",
    document_verification_status: "pending",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        contact_email: profile.contact_email || user?.email || "",
        phone: profile.phone || "",
        company: profile.company || "",
        avatar_url: profile.avatar_url || "",
        prc_license: profile.prc_license || "",
        work_experience: profile.work_experience || "",
        preferred_location: profile.preferred_location || "",
        tin_number: profile.tin_number || "",
        government_id: profile.government_id || "",
        document_verification_status: profile.document_verification_status || "pending",
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        contact_email: user.email || "",
      }));
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          title: formData.title,
          bio: formData.bio,
          contact_email: formData.contact_email,
          phone: formData.phone,
          company: formData.company,
          avatar_url: formData.avatar_url,
          prc_license: formData.prc_license,
          work_experience: formData.work_experience,
          preferred_location: formData.preferred_location,
          tin_number: formData.tin_number,
          government_id: formData.government_id,
          document_verification_status: formData.document_verification_status,
          user_type: profile?.user_type || 'medical_professional',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      navigate("/platform");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitDocuments = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prc_license: formData.prc_license,
          tin_number: formData.tin_number,
          government_id: formData.government_id,
          document_verification_status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        document_verification_status: "submitted"
      }));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const calculateCompletionPercentage = () => {
    let filledFields = 0;
    let totalFields = 0;
    
    const basicFields = ['first_name', 'last_name', 'title', 'bio', 'avatar_url'];
    basicFields.forEach(field => {
      totalFields++;
      if (formData[field as keyof ProfileFormData] && String(formData[field as keyof ProfileFormData]).trim() !== '') {
        filledFields++;
      }
    });
    
    const contactFields = ['contact_email', 'phone'];
    contactFields.forEach(field => {
      totalFields++;
      if (formData[field as keyof ProfileFormData] && String(formData[field as keyof ProfileFormData]).trim() !== '') {
        filledFields++;
      }
    });
    
    if (profile?.user_type === 'medical_professional') {
      const professionalFields = ['prc_license', 'work_experience', 'preferred_location'];
      professionalFields.forEach(field => {
        totalFields++;
        if (formData[field as keyof ProfileFormData] && String(formData[field as keyof ProfileFormData]).trim() !== '') {
          filledFields++;
        }
      });
    }
    
    const documentFields = ['prc_license', 'tin_number', 'government_id'];
    documentFields.forEach(field => {
      totalFields++;
      if (formData[field as keyof ProfileFormData] && String(formData[field as keyof ProfileFormData]).trim() !== '') {
        filledFields++;
      }
    });
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  const isDocumentVerificationComplete = 
    formData.document_verification_status === "verified" ||
    (formData.prc_license && formData.tin_number && formData.government_id);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ProfileHeader completionPercentage={completionPercentage} />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <TabContentWrapper 
              handleSubmit={handleSubmit} 
              loading={loading}
              submitText="Save Basic Info"
            >
              <BasicProfileInfo 
                firstName={formData.first_name}
                lastName={formData.last_name}
                title={formData.title}
                bio={formData.bio}
                avatarUrl={formData.avatar_url}
                handleChange={handleChange}
              />
            </TabContentWrapper>
          </TabsContent>
          
          <TabsContent value="professional">
            <TabContentWrapper 
              handleSubmit={handleSubmit} 
              loading={loading}
              backAction={() => setActiveTab("basic")}
              submitText="Save Professional Info"
            >
              {profile?.user_type === 'medical_professional' && (
                <MedicalProfessionalInfo
                  prcLicense={formData.prc_license}
                  workExperience={formData.work_experience}
                  preferredLocation={formData.preferred_location}
                  handleChange={handleChange}
                />
              )}
            </TabContentWrapper>
          </TabsContent>
          
          <TabsContent value="contact">
            <TabContentWrapper 
              handleSubmit={handleSubmit} 
              loading={loading}
              backAction={() => setActiveTab("professional")}
              submitText="Save Contact Info"
            >
              <ContactInfo
                contactEmail={formData.contact_email}
                phone={formData.phone}
                company={formData.company}
                handleChange={handleChange}
              />
            </TabContentWrapper>
          </TabsContent>
          
          <TabsContent value="verification">
            <div className="space-y-6 pt-4">
              <DocumentVerification
                prcLicense={formData.prc_license}
                tin={formData.tin_number}
                govId={formData.government_id}
                onPrcLicenseChange={(value) => setFormData(prev => ({ ...prev, prc_license: value }))}
                onTinChange={(value) => setFormData(prev => ({ ...prev, tin_number: value }))}
                onGovIdChange={(value) => setFormData(prev => ({ ...prev, government_id: value }))}
                onSubmit={submitDocuments}
                isComplete={formData.document_verification_status === "verified"}
                status={formData.document_verification_status as "pending" | "submitted" | "verified" | "rejected"}
              />
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("contact")}>
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={loading || !isDocumentVerificationComplete}
                >
                  {loading ? "Saving..." : "Save All Profile"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
