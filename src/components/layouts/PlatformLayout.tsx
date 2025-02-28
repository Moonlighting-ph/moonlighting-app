
import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Building,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Moon } from '@/components/ui/Moon';

interface PlatformLayoutProps {
  children: ReactNode;
}

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full bg-background border-b z-40 h-16">
        <div className="container h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/platform" className="flex items-center group">
              <span className="sr-only">Moonlighting.ph</span>
              <Moon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg ml-2 hidden sm:block">moonlighting.ph</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center w-full max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs, hospitals..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-accent/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Link to="/platform/messages">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1590086782792-42dd2350140d" alt="User" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/platform/professional-profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/platform/settings" className="cursor-pointer w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/platform") && !isActive("/platform/jobs") && !isActive("/platform/messages") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/jobs") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform/jobs">
                  <Briefcase className="h-5 w-5 mr-3" />
                  Jobs
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/messages") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform/messages">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Messages
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="px-3 py-2 mt-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Account</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/platform/professional-profile") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform/professional-profile">
                  <User className="h-5 w-5 mr-3" />
                  My Profile
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/hospital-profile") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform/hospital-profile">
                  <Building className="h-5 w-5 mr-3" />
                  Hospital Profile
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/settings") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to="/platform/settings">
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-auto px-3 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:ml-64 min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default PlatformLayout;
