
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/auth/login";
import Profile from "./pages/profile";
import Jobs from "./pages/Jobs";
import ProviderDashboard from "./pages/provider";
import MoonlighterDashboard from "./pages/moonlighter";
import NotFound from "./pages/NotFound";
import PostJob from "./pages/provider/PostJob";
import JobDetail from "./pages/jobs/JobDetail";
import EditJob from "./pages/provider/EditJob";
import Applications from "./pages/provider/Applications";
import MoonlighterApplications from "./pages/moonlighter/Applications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/provider/post-job" element={<PostJob />} />
            <Route path="/provider/edit-job/:jobId" element={<EditJob />} />
            <Route path="/provider/applications" element={<Applications />} />
            <Route path="/moonlighter" element={<MoonlighterDashboard />} />
            <Route path="/moonlighter/applications" element={<MoonlighterApplications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
