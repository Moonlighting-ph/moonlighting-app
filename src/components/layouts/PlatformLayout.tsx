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
  Search,
  Calendar,
  DollarSign,
  CheckCircle,
  Info,
  MessageCircle,
  Clock,
  ChevronRight
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlatformLayoutProps {
  children: ReactNode;
}

// Sample notification data
const notifications = [
  {
    id: '1',
    title: 'Application Reviewed',
    description: 'Your application for ER Nurse at Metro Manila General Hospital has been reviewed.',
    time: '10 minutes ago',
    read: false,
    type: 'application',
    link: '/platform/jobs'
  },
  {
    id: '2',
    title: 'Interview Invitation',
    description: 'You have been invited to an interview for ICU Nurse position at St. Luke\'s Medical Center.',
    time: '2 hours ago',
    read: false,
    type: 'interview',
    link: '/platform/messages'
  },
  {
    id: '3',
    title: 'Shift Reminder',
    description: 'Reminder: Your shift as ER Nurse starts tomorrow at 10:00 PM.',
    time: '5 hours ago',
    read: true,
    type: 'reminder',
    link: '/platform'
  },
  {
    id: '4',
    title: 'Payment Received',
    description: 'You have received a payment of ₱5,400 for your last shift.',
    time: '1 day ago',
    read: true,
    type: 'payment',
    link: '/platform/settings'
  },
  {
    id: '5',
    title: 'New Message',
    description: 'Dr. Santos sent you a message regarding your upcoming shift.',
    time: '2 days ago',
    read: true,
    type: 'message',
    link: '/platform/messages'
  }
];

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Number of unread notifications
  const unreadCount = notificationList.filter(notification => !notification.read).length;
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationList(
      notificationList.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  // Mark a specific notification as read
  const markAsRead = (id: string) => {
    setNotificationList(
      notificationList.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-violet-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
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
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="end" 
                className={cn("w-80 md:w-96 p-0", 
                  isMobile ? "h-[80vh]" : "max-h-[600px]"
                )}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8 px-2" 
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <ScrollArea className={cn("p-0", isMobile ? "h-[calc(80vh-56px)]" : "max-h-[544px]")}>
                  {notificationList.length > 0 ? (
                    <div className="divide-y">
                      {notificationList.map((notification) => (
                        <div 
                          key={notification.id}
                          className={cn(
                            "p-4 hover:bg-muted/50 transition-colors", 
                            notification.read ? "" : "bg-primary/5"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Link 
                            to={notification.link}
                            className="flex gap-3"
                            onClick={() => setNotificationOpen(false)}
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className={cn("font-medium text-sm", notification.read ? "" : "text-primary")}>
                                  {notification.title}
                                </p>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                  {notification.time}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {notification.description}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">No new notifications</p>
                      <p className="text-xs text-muted-foreground">
                        We'll let you know when something arrives
                      </p>
                    </div>
                  )}
                </ScrollArea>
                {notificationList.length > 0 && (
                  <div className="p-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs justify-between"
                      onClick={() => setNotificationOpen(false)}
                    >
                      <span>View all notifications</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
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
            <h2 className="mb-2 px-4 text-sm font-semibold">Dashboard</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/platform") && !isActive("/platform/jobs") && !isActive("/platform/messages") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform">
                  <LayoutDashboard className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/jobs") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform/jobs">
                  <Briefcase className="h-4 w-4 mr-3" />
                  Jobs
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/messages") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform/messages">
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Messages
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="px-3 py-2 mt-1">
            <h2 className="mb-2 px-4 text-sm font-semibold">Account</h2>
            <div className="space-y-1">
              <Button
                variant={isActive("/platform/professional-profile") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform/professional-profile">
                  <User className="h-4 w-4 mr-3" />
                  My Profile
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/hospital-profile") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform/hospital-profile">
                  <Building className="h-4 w-4 mr-3" />
                  Hospital Profile
                </Link>
              </Button>
              <Button
                variant={isActive("/platform/settings") ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                asChild
              >
                <Link to="/platform/settings">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-auto px-3 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
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
