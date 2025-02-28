import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Smile
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'

// sample conversation data
const conversations = [
  {
    id: 'conv1',
    name: 'Dr. Maria Reyes',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&crop=faces',
    role: 'Cardiologist',
    company: 'Metro Manila General Hospital',
    status: 'online',
    lastMessage: 'Looking forward to our meeting tomorrow at 9 AM.',
    time: '10:45 AM',
    unread: 0,
    isActive: true
  },
  {
    id: 'conv2',
    name: "St. Luke's Medical Center HR",
    avatar:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&h=200&fit=crop',
    role: 'Human Resources',
    company: "St. Luke's Medical Center",
    status: 'offline',
    lastMessage:
      'Your application for the ICU Nurse position has been reviewed. We would like to invite you for an interview.',
    time: 'Yesterday',
    unread: 2,
    isActive: false
  },
  {
    id: 'conv3',
    name: 'Dr. James Santos',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&crop=faces',
    role: 'Neurosurgeon',
    company: 'Philippine General Hospital',
    status: 'offline',
    lastMessage: 'Can you please provide your availability for the upcoming week?',
    time: 'Yesterday',
    unread: 0,
    isActive: false
  },
  {
    id: 'conv4',
    name: 'Makati Medical Center',
    avatar:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&h=200&fit=crop',
    role: 'Recruitment Team',
    company: 'Makati Medical Center',
    status: 'offline',
    lastMessage: 'Thank you for your interest in our hospital. We have reviewed your profile.',
    time: 'Monday',
    unread: 0,
    isActive: false
  },
  {
    id: 'conv5',
    name: 'Nurse Coordinator',
    avatar:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&crop=faces',
    role: 'Nursing Department',
    company: 'Philippine Heart Center',
    status: 'online',
    lastMessage: 'Hi Maria, your shift schedule for next week has been finalized.',
    time: 'Aug 15',
    unread: 1,
    isActive: false
  }
]

// sample messages with a date property
const messageHistory = [
  {
    id: 'msg1',
    sender: 'them',
    content: "Hello Maria, I hope you're doing well today.",
    time: '10:30 AM',
    read: true,
    date: 'yesterday'
  },
  {
    id: 'msg2',
    sender: 'them',
    content:
      "I wanted to discuss your upcoming shift at the cardiac care unit next week.",
    time: '10:31 AM',
    read: true,
    date: 'yesterday'
  },
  {
    id: 'msg3',
    sender: 'me',
    content: "Hi Dr. Reyes, I'm doing great. Thanks for reaching out.",
    time: '10:35 AM',
    read: true,
    date: 'yesterday'
  },
  {
    id: 'msg4',
    sender: 'me',
    content:
      "Yes, I'm available for the shift. Is there anything specific I should prepare for?",
    time: '10:36 AM',
    read: true,
    date: 'yesterday'
  },
  {
    id: 'msg5',
    sender: 'them',
    content:
      "We're expecting a patient transfer from another facility. They have a complex cardiac condition that will require close monitoring.",
    time: '10:40 AM',
    read: true,
    date: 'today'
  },
  {
    id: 'msg6',
    sender: 'them',
    content:
      "I'll share the patient's details with you before your shift starts. Would you be able to come in 30 minutes early for a briefing?",
    time: '10:42 AM',
    read: true,
    date: 'today'
  },
  {
    id: 'msg7',
    sender: 'me',
    content:
      "Absolutely, I can come early. I appreciate the heads up about the patient transfer.",
    time: '10:44 AM',
    read: true,
    date: 'today'
  },
  {
    id: 'msg8',
    sender: 'them',
    content: 'Looking forward to our meeting tomorrow at 9 AM.',
    time: '10:45 AM',
    read: false,
    date: 'today'
  }
]

// helper function to group messages by date
const groupMessagesByDate = (messages) => {
  const groups = {}
  messages.forEach((msg) => {
    const group = msg.date || 'today'
    if (!groups[group]) groups[group] = []
    groups[group].push(msg)
  })
  return groups
}

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [message, setMessage] = useState('')
  const [conversationsList, setConversationsList] = useState(conversations)
  const [searchTerm, setSearchTerm] = useState('')
  const [showConversation, setShowConversation] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    // scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' })
    if (isMobile) {
      setShowConversation(false)
    }
  }, [isMobile, messageHistory])

  const handleSendMessage = () => {
    if (!message.trim()) return
    console.log(`sending message: ${message}`)
    setMessage('')
  }

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation)
    if (isMobile) {
      setShowConversation(true)
    }
  }

  const filteredConversations = conversationsList.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBackToList = () => {
    setShowConversation(false)
  }

  const groupedMessages = groupMessagesByDate(messageHistory)

  return (
    <div className="container px-4 py-6 md:py-8 h-[600px] overflow-hidden">
      <div className="flex flex-col h-full border rounded-lg overflow-hidden max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full divide-x">
          {/* conversation list */}
          <div
            className={`md:col-span-4 lg:col-span-3 flex flex-col h-full overflow-y-auto ${
              isMobile && showConversation ? 'hidden' : 'block'
            }`}
          >
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold mb-4">messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="search conversations..."
                  className="pl-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 md:p-4 flex gap-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                        conversation.id === activeConversation?.id ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.status === 'online' && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="font-medium text-sm truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 truncate">{conversation.company}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <p className="text-sm text-muted-foreground">no conversations found</p>
                </div>
              )}
            </div>
          </div>
          {/* conversation view */}
          <div
            className={`md:col-span-8 lg:col-span-9 flex flex-col h-full ${
              isMobile && !showConversation ? 'hidden' : 'block'
            }`}
          >
            {activeConversation ? (
              <div className="flex flex-col h-full">
                {/* conversation header */}
                <div className="p-3 md:p-4 border-b flex items-center justify-between bg-background z-10">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <Button variant="ghost" size="icon" onClick={handleBackToList} className="md:hidden">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{activeConversation.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="truncate">
                          {activeConversation.role} • {activeConversation.company}
                        </span>
                        {activeConversation.status === 'online' && (
                          <Badge
                            variant="outline"
                            className="ml-2 h-auto py-0 px-1.5 text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            online
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs cursor-pointer">
                          view profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer">
                          search in conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs cursor-pointer text-destructive">
                          delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* messages scroll area with shorter max-height */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 max-h-[350px]">
                  {Object.entries(groupMessagesByDate(messageHistory)).map(([group, msgs]) => (
                    <div key={group}>
                      <div className="text-center mb-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          {group}
                        </span>
                      </div>
                      <div className="space-y-4 mb-4">
                        {msgs.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex gap-2 max-w-[80%]">
                              {msg.sender === 'them' && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div className={`rounded-lg px-3 py-2 text-sm ${
                                  msg.sender === 'me'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                                }`}>
                                  {msg.content}
                                </div>
                                <div className="flex items-center mt-1 gap-1">
                                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                  {msg.sender === 'me' &&
                                    (msg.read ? (
                                      <CheckCheck className="h-3 w-3 text-primary" />
                                    ) : (
                                      <Check className="h-3 w-3 text-muted-foreground" />
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
                {/* message input */}
                <div className="p-3 md:p-4 border-t bg-background">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                        <Smile className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                        <Paperclip className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 hidden md:flex">
                        <ImageIcon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      </Button>
                    </div>
                    <Input
                      placeholder="type a message..."
                      className="text-sm h-8 md:h-10"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="max-w-md text-center">
                  <h3 className="text-lg font-medium mb-2">select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    choose a conversation from the list to start messaging.
                  </p>
                </div>
    
