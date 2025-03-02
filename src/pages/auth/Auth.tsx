
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function Auth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    checkSession();
  }, []);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="animate-pulse text-center">
          <h2 className="text-xl font-medium text-blue-700">Loading...</h2>
        </div>
      </div>
    );
  }
  
  if (session) {
    return <Navigate to="/platform" replace />;
  }

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/platform`,
        },
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast({
        title: "Login Error",
        description: "Could not connect to Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-20 right-20 h-60 w-60 rounded-full bg-indigo-300 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md overflow-hidden border-none bg-white/80 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        <CardHeader className="space-y-1 pt-6">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">Welcome</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="animate-in fade-in-50">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="animate-in fade-in-50">
              <SignUpForm />
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white/90 font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Continue with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <p className="text-center text-xs text-gray-600">
            By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
