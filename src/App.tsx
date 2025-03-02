
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./pages/platform/Dashboard";
import Jobs from "./pages/platform/Jobs";
import JobDetail from "./pages/platform/JobDetail";
import ProfessionalProfile from "./pages/platform/ProfessionalProfile";
import PlatformLayout from "./components/layouts/PlatformLayout";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth/Auth";

// Provider Dashboard
import ProviderDashboard from "./pages/platform/ProviderDashboard";

// Hospital Job Management Pages
import HospitalJobs from "./pages/platform/HospitalJobs";
import NewJobPosting from "./pages/platform/NewJobPosting";
import EditJobPosting from "./pages/platform/EditJobPosting";

// Non-MVP pages (still imported but will be hidden in navigation)
import HospitalProfile from "./pages/platform/HospitalProfile";
import Messages from "./pages/platform/Messages";
import Settings from "./pages/platform/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Redirect from root to platform or auth page based on authentication */}
            <Route path="/" element={<Navigate to="/platform" replace />} />
            
            {/* Protected platform routes with conditional dashboard rendering */}
            <Route 
              path="/platform" 
              element={
                <PrivateRoute>
                  <PlatformLayout>
                    <DashboardRouter />
                  </PlatformLayout>
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/platform/jobs" 
              element={
                <PrivateRoute>
                  <PlatformLayout><Jobs /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/job/:id" 
              element={
                <PrivateRoute>
                  <PlatformLayout><JobDetail /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/professional-profile" 
              element={
                <PrivateRoute>
                  <PlatformLayout><ProfessionalProfile /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            
            {/* Hospital Job Management Routes */}
            <Route 
              path="/platform/hospital-jobs" 
              element={
                <PrivateRoute>
                  <PlatformLayout><HospitalJobs /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/hospital-jobs/new" 
              element={
                <PrivateRoute>
                  <PlatformLayout><NewJobPosting /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/hospital-jobs/edit/:id" 
              element={
                <PrivateRoute>
                  <PlatformLayout><EditJobPosting /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            
            {/* Non-MVP Routes - still accessible but hidden from navigation */}
            <Route 
              path="/platform/hospital-profile" 
              element={
                <PrivateRoute>
                  <PlatformLayout><HospitalProfile /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/messages" 
              element={
                <PrivateRoute>
                  <PlatformLayout><Messages /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/platform/settings" 
              element={
                <PrivateRoute>
                  <PlatformLayout><Settings /></PlatformLayout>
                </PrivateRoute>
              } 
            />
            
            {/* Catch-all - must be at bottom */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Component that routes to the appropriate dashboard based on user type
function DashboardRouter() {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return <HospitalJobsLoading />;
  }
  
  // Route based on user type
  if (profile?.user_type === 'medical_provider') {
    return <ProviderDashboard />;
  }
  
  // Default to professional dashboard
  return <Dashboard />;
}

export default App;
