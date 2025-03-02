
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfessionalProfile() {
  const { profile } = useAuth();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      {profile?.user_type === 'medical_professional' ? (
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Medical Professional
          </span>
        </div>
      ) : profile?.user_type === 'medical_provider' ? (
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Medical Provider
          </span>
        </div>
      ) : null}
      <ProfileForm />
    </div>
  );
}
