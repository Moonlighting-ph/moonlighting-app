
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/platform/Dashboard";
import Jobs from "./pages/platform/Jobs";
import JobDetail from "./pages/platform/JobDetail";
import ProfessionalProfile from "./pages/platform/ProfessionalProfile";
import PlatformLayout from "./components/layouts/PlatformLayout";
import NotFound from "./pages/NotFound";

// Non-MVP pages (still imported but will be hidden in navigation)
import HospitalProfile from "./pages/platform/HospitalProfile";
import Messages from "./pages/platform/Messages";
import Settings from "./pages/platform/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect from root to platform */}
          <Route path="/" element={<Navigate to="/platform" replace />} />
          
          {/* MVP Routes - wrapped with PlatformLayout */}
          <Route path="/platform" element={<PlatformLayout><Dashboard /></PlatformLayout>} />
          <Route path="/platform/jobs" element={<PlatformLayout><Jobs /></PlatformLayout>} />
          <Route path="/platform/job/:id" element={<PlatformLayout><JobDetail /></PlatformLayout>} />
          <Route path="/platform/professional-profile" element={<PlatformLayout><ProfessionalProfile /></PlatformLayout>} />
          
          {/* Non-MVP Routes - still accessible but hidden from navigation */}
          <Route path="/platform/hospital-profile" element={<PlatformLayout><HospitalProfile /></PlatformLayout>} />
          <Route path="/platform/messages" element={<PlatformLayout><Messages /></PlatformLayout>} />
          <Route path="/platform/settings" element={<PlatformLayout><Settings /></PlatformLayout>} />
          
          {/* Catch-all - must be at bottom */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
