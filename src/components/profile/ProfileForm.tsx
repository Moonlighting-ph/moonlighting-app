
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.avatar_url || undefined} />
                <AvatarFallback>{formData.first_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button" className="text-xs">
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                (Coming soon)
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Registered Nurse"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {profile?.user_type === 'medical_professional' && (
            <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/50 rounded-md">
              <h3 className="font-medium text-blue-800">Medical Professional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="prc_license">PRC License Number</Label>
                <Input
                  id="prc_license"
                  name="prc_license"
                  placeholder="Enter your license number"
                  value={formData.prc_license}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="work_experience">Work Experience</Label>
                <Textarea
                  id="work_experience"
                  name="work_experience"
                  placeholder="Describe your clinical experience, specialties, and years of practice"
                  className="min-h-[100px]"
                  value={formData.work_experience}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred_location">Preferred Work Location</Label>
                <Input
                  id="preferred_location"
                  name="preferred_location"
                  placeholder="e.g. Manila, Metro Manila, Philippines"
                  value={formData.preferred_location}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Hospital/Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="Where do you work?"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
