
import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Clock, 
  Send, 
  PaperclipIcon, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Sample conversation data
const conversations = [
  {
    id: 'conv1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&crop=faces',
    name: 'Dr. Anna Santos',
    role: 'Medical Director',
    company: 'Metro Manila General Hospital',
    lastMessage: 'Looking forward to your interview tomorrow at 10 AM.',
    time: '10:42 AM',
    unread: 2,
    online: true,
    active: true,
    messages: [
      {
        id: 'msg1',
        sender: 'them',
        content: 'Hello! We\'ve reviewed your application for the ER Nurse position at Metro Manila General Hospital.',
        time: '9:30 AM',
        read: true
      },
      {
        id: 'msg2',
        sender: 'them',
        content: 'We\'re impressed with your qualifications and would like to schedule an interview with you.',
        time: '9:31 AM',
        read: true
      },
      {
        id: 'msg3',
        sender: 'me',
        content: 'Hello Dr. Santos! Thank you for considering my application. I\'m very interested in the position.',
        time: '9:45 AM',
        read: true
      },
      {
        id: 'msg4',
        sender: 'me',
        content: 'I would be available for an interview anytime this week.',
        time: '9:46 AM',
        read: true
      },
      {
        id: 'msg5',
        sender: 'them',
        content: 'Perfect! How about tomorrow at 10 AM? We can do a video call or in-person if you prefer.',
        time: '10:02 AM',
        read: true
      },
      {
        id: 'msg6',
        sender: 'me',
        content: 'Tomorrow at 10 AM works great for me. I prefer a video call if that\'s convenient.',
        time: '10:15 AM',
        read: true
      },
      {
        id: 'msg7',
        sender: 'them',
        content: 'Video call it is. I\'ll send you a link closer to the time. Please prepare your PRC license and certificates for verification.',
        time: '10:30 AM',
        read: true
      },
      {
        id: 'msg8',
        sender: 'them',
        content: 'Also, could you please prepare a brief presentation about your experience in emergency care? Just 5 minutes to showcase your approach.',
        time: '10:35 AM',
        read: true
      },
      {
        id: 'msg9',
        sender: 'them',
        content: 'Looking forward to your interview tomorrow at 10 AM.',
        time: '10:42 AM',
        read: false
      },
      {
        id: 'msg10',
        sender: 'them',
        content: 'Don\'t forget to check your email for the meeting link!',
        time: '10:45 AM',
        read: false
      }
    ]
  },
  {
    id: 'conv2',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&crop=faces',
    name: 'Maria Reyes',
    role: 'HR Manager',
    company: 'St. Luke\'s Medical Center',
    lastMessage: 'Your application for ICU Nurse has been received. We\'ll review it soon.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    active: false,
    messages: [
      {
        id: 'msg1',
        sender: 'them',
        content: 'Hello! Thank you for applying to the ICU Nurse position at St. Luke\'s Medical Center.',
        time: 'Yesterday, 2:30 PM',
        read: true
      },
      {
        id: 'msg2',
        sender: 'them',
        content: 'Your application has been received and is currently under review.',
        time: 'Yesterday, 2:31 PM',
        read: true
      },
      {
        id: 'msg3',
        sender: 'them',
        content: 'Our team is evaluating all applications and we expect to begin interviews next week.',
        time: 'Yesterday, 2:32 PM',
        read: true
      },
      {
        id: 'msg4',
        sender: 'me',
        content: 'Thank you for the confirmation. I\'m looking forward to hearing back from you.',
        time: 'Yesterday, 3:15 PM',
        read: true
      },
      {
        id: 'msg5',
        sender: 'them',
        content: 'Your application for ICU Nurse has been received. We\'ll review it soon.',
        time: 'Yesterday, 5:45 PM',
        read: true
      }
    ]
  },
  {
    id: 'conv3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&crop=faces',
    name: 'Dr. Ramon Cruz',
    role: 'Department Head',
    company: 'Philippine General Hospital',
    lastMessage: 'Congratulations! Your application for General Practitioner has been accepted.',
    time: 'Jul 12',
    unread: 0,
    online: true,
    active: false,
    messages: [
      {
        id: 'msg1',
        sender: 'them',
        content: 'Congratulations! Your application for General Practitioner has been accepted.',
        time: 'Jul 12, 9:20 AM',
        read: true
      }
    ]
  },
  {
    id: 'conv4',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&crop=faces',
    name: 'Lisa Gomez',
    role: 'Nursing Director',
    company: 'Makati Medical Center',
    lastMessage: 'We need to reschedule our meeting to Thursday. Is that okay?',
    time: 'Jul 10',
    unread: 0,
    online: false,
    active: false,
    messages: [
      {
        id: 'msg1',
        sender: 'them',
        content: 'We need to reschedule our meeting to Thursday. Is that okay?',
        time: 'Jul 10, 11:15 AM',
        read: true
      }
    ]
  },
  {
    id: 'conv5',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&crop=faces',
    name: 'Roberto Santos',
    role: 'Medical Recruiter',
    company: 'The Medical City',
    lastMessage: 'Thank you for your interest. Unfortunately, the position has been filled.',
    time: 'Jul 5',
    unread: 0,
    online: false,
    active: false,
    messages: [
      {
        id: 'msg1',
        sender: 'them',
        content: 'Thank you for your interest. Unfortunately, the position has been filled.',
        time: 'Jul 5, 3:45 PM',
        read: true
      }
    ]
  }
];

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('contacts');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter(
    conversation => conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    conversation.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      // In a real app, we would add the message to the conversation
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="container h-[calc(100vh-4rem)] flex flex-col px-0 md:py-8 md:px-4 overflow-hidden">
      <div className="flex flex-col h-full rounded-lg border overflow-hidden">
        <div className="hidden md:flex p-4 border-b">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        
        <div className={`flex-1 flex overflow-hidden ${mobileView === 'chat' ? 'md:flex' : 'flex md:flex'}`}>
          {/* Conversations List - Hidden on mobile when chat is active */}
          <div className={`w-full md:w-1/3 border-r ${mobileView === 'chat' ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="p-3">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="unread">Unread (2)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-2">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors ${conversation.active ? 'bg-accent' : ''}`}
                        onClick={() => {
                          setActiveConversation(conversation);
                          setMobileView('chat');
                        }}
                      >
                        <div className="flex items-start">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.avatar} />
                              <AvatarFallback>
                                {conversation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                            )}
                          </div>
                          <div className="ml-3 overflow-hidden flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold truncate">{conversation.name}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.company}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs truncate text-muted-foreground">
                                {conversation.lastMessage}
                              </p>
                              {conversation.unread > 0 && (
                                <Badge className="h-5 w-5 text-xs flex items-center justify-center rounded-full p-0">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {filteredConversations.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No conversations found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="unread" className="mt-2">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  <div className="space-y-1">
                    {filteredConversations.filter(c => c.unread > 0).map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors ${conversation.active ? 'bg-accent' : ''}`}
                        onClick={() => {
                          setActiveConversation(conversation);
                          setMobileView('chat');
                        }}
                      >
                        <div className="flex items-start">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.avatar} />
                              <AvatarFallback>
                                {conversation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                            )}
                          </div>
                          <div className="ml-3 overflow-hidden flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold truncate">{conversation.name}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.company}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs truncate text-muted-foreground">
                                {conversation.lastMessage}
                              </p>
                              {conversation.unread > 0 && (
                                <Badge className="h-5 w-5 text-xs flex items-center justify-center rounded-full p-0">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {filteredConversations.filter(c => c.unread > 0).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No unread messages</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Conversation Detail */}
          <div className={`w-full md:w-2/3 flex flex-col ${mobileView === 'contacts' ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 md:hidden"
                      onClick={() => setMobileView('contacts')}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.avatar} />
                      <AvatarFallback>
                        {activeConversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h2 className="font-semibold">{activeConversation.name}</h2>
                        {activeConversation.online && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 h-5 text-xs">
                            Online
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.role} at {activeConversation.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Block user</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'them' && (
                          <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                            <AvatarImage src={activeConversation.avatar} />
                            <AvatarFallback>
                              {activeConversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] ${message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-lg px-4 py-2`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.time}
                            {message.sender === 'me' && (
                              <span className="ml-2">
                                {message.read ? (
                                  <span>✓✓</span>
                                ) : (
                                  <span>✓</span>
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        className="pr-10 py-6"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button size="icon" className="flex-shrink-0" onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
