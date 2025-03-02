
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { BasicProfileInfo } from "./BasicProfileInfo";
import { MedicalProfessionalInfo } from "./MedicalProfessionalInfo";
import { ContactInfo } from "./ContactInfo";

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
};

export default function ProfileForm() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Please add some additional information to complete your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicProfileInfo 
            firstName={formData.first_name}
            lastName={formData.last_name}
            title={formData.title}
            bio={formData.bio}
            avatarUrl={formData.avatar_url}
            handleChange={handleChange}
          />
          
          {profile?.user_type === 'medical_professional' && (
            <MedicalProfessionalInfo
              prcLicense={formData.prc_license}
              workExperience={formData.work_experience}
              preferredLocation={formData.preferred_location}
              handleChange={handleChange}
            />
          )}
          
          <ContactInfo
            contactEmail={formData.contact_email}
            phone={formData.phone}
            company={formData.company}
            handleChange={handleChange}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
