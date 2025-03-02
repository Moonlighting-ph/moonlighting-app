
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("medical_professional");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Redirect to profile completion
      navigate("/platform/professional-profile");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full-name" className="text-gray-700">Full Name</Label>
        <Input
          id="full-name"
          placeholder="John Doe"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters long
        </p>
      </div>
      <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50/50 p-3">
        <Label className="text-gray-700">I am a:</Label>
        <RadioGroup
          value={userType}
          onValueChange={setUserType}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medical_professional" id="professional" />
            <Label htmlFor="professional" className="font-normal text-gray-700">
              Medical Professional
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medical_provider" id="provider" />
            <Label htmlFor="provider" className="font-normal text-gray-700">
              Medical Provider/Hospital
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200" 
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
