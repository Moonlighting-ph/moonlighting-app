
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ConversationList from '@/components/messages/ConversationList';
import ConversationView from '@/components/messages/ConversationView';
import EmptyConversation from '@/components/messages/EmptyConversation';
import { MessageType, ConversationType, GroupedMessages } from '@/types/messages';

// sample conversation data
const conversations: ConversationType[] = [
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
];

// sample messages with a date property
const messageHistory: MessageType[] = [
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
];

// helper function to group messages by date
const groupMessagesByDate = (messages: MessageType[]): GroupedMessages => {
  const groups: GroupedMessages = {}
  messages.forEach((msg) => {
    const group = msg.date || 'today'
    if (!groups[group]) groups[group] = []
    groups[group].push(msg)
  })
  return groups
}

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(conversations[0]);
  const [conversationsList, setConversationsList] = useState(conversations);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConversation, setShowConversation] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setShowConversation(false);
    }
  }, [isMobile]);

  const handleSendMessage = (message: string) => {
    console.log(`sending message: ${message}`);
  };

  const handleSelectConversation = (conversation: ConversationType) => {
    setActiveConversation(conversation);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  const groupedMessages = groupMessagesByDate(messageHistory);

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
            <ConversationList
              conversations={conversationsList}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
            />
          </div>
          
          {/* conversation view */}
          <div
            className={`md:col-span-8 lg:col-span-9 flex flex-col h-full ${
              isMobile && !showConversation ? 'hidden' : 'block'
            }`}
          >
            {activeConversation ? (
              <ConversationView
                conversation={activeConversation}
                groupedMessages={groupedMessages}
                onSendMessage={handleSendMessage}
                onBackToList={handleBackToList}
                isMobile={isMobile}
              />
            ) : (
              <EmptyConversation />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
