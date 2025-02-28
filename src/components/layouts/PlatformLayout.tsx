import { useState, ReactNode, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  layoutdashboard,
  briefcase,
  messagesquare,
  bell,
  settings,
  logout,
  menu,
  x,
  user,
  building,
  search,
  calendar,
  dollarsign,
  checkcircle,
  info,
  messagecircle,
  clock,
  chevronright,
  chevronleft,
  chevrondown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Moon } from '@/components/ui/moon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'

interface PlatformLayoutProps {
  children: ReactNode
}

const notifications = [
  // ... your notifications array here
]

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const isMobile = useIsMobile()

  const unreadCount = notificationList.filter(
    notification => !notification.read
  ).length

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const markAllAsRead = () => {
    setNotificationList(
      notificationList.map(notification => ({
        ...notification,
        read: true
      }))
    )
  }

  const markAsRead = (id: string) => {
    setNotificationList(
      notificationList.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <briefcase className="h-5 w-5 text-blue-500" />
      case 'interview':
        return <calendar className="h-5 w-5 text-green-500" />
      case 'payment':
        return <dollarsign className="h-5 w-5 text-amber-500" />
      case 'message':
        return <messagecircle className="h-5 w-5 text-violet-500" />
      case 'reminder':
        return <clock className="h-5 w-5 text-orange-500" />
      default:
        return <info className="h-5 w-5 text-primary" />
    }
  }

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-background">
      {/* top navigation bar */}
      <header className="fixed top-0 w-full bg-background border-b z-40 h-16">
        <div className="container h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              {sidebarOpen ? <x className="h-5 w-5" /> : <menu className="h-5 w-5" />}
            </Button>
            <Link to="/platform" className="flex items-center group">
              <span className="sr-only">moonlighting.ph</span>
              <Moon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg ml-2 hidden sm:block">moonlighting.ph</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center w-full max-w-sm mx-4">
            <div className="relative w-full">
              <search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="search jobs, hospitals..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-accent/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className={cn("w-80 md:w-96 p-0", isMobile ? "h-[80vh]" : "max-h-[600px]")}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-2"
                      onClick={markAllAsRead}
                    >
                      mark all as read
                    </Button>
                  )}
                </div>
                <ScrollArea
                  className={cn("p-0", isMobile ? "h-[calc(80vh-56px)]" : "max-h-[544px]")}
                >
                  {/* notifications list */}
                </ScrollArea>
                {notificationList.length > 0 && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs justify-between"
                      onClick={() => setNotificationOpen(false)}
                    >
                      <span>view all notifications</span>
                      <chevronright className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Link to="/platform/messages">
              <Button variant="ghost" size="icon">
                <messagesquare className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1590086782792-42dd2350140d"
                      alt="user"
                    />
                    <AvatarFallback>ms</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>my account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/platform/professional-profile" className="cursor-pointer w-full">
                    <user className="mr-2 h-4 w-4" />
                    <span>profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/platform/settings" className="cursor-pointer w-full">
                    <settings className="mr-2 h-4 w-4" />
                    <span>settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <logout className="mr-2 h-4 w-4" />
                  <span>log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* sidebar navigation */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarCollapsed ? 'md:w-[4.5rem]' : 'md:w-64'}`}
      >
        <div className="flex flex-col h-full py-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-2 -mr-3 bg-background border border-border rounded-full hidden md:flex"
            onClick={toggleSidebarCollapse}
          >
            {sidebarCollapsed ? (
              <chevronright className="h-4 w-4" />
            ) : (
              <chevronleft className="h-4 w-4" />
            )}
          </Button>
          {/* sidebar content */}
        </div>
      </aside>

      {/* main content */}
      <main
        className={`pt-16 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[4.5rem]' : 'md:ml-64'
        } min-h-screen`}
      >
        <div className="flex-1 w-full max-w-7xl mx-auto">{children}</div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default PlatformLayout
