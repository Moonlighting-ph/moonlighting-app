
import React, { useRef, useEffect } from 'react';
import ConversationHeader from './ConversationHeader';
import MessageGroup from './MessageGroup';
import MessageInput from './MessageInput';
import { ConversationType, GroupedMessages } from '@/types/messages';

interface ConversationViewProps {
  conversation: ConversationType;
  groupedMessages: GroupedMessages;
  onSendMessage: (message: string) => void;
  onBackToList: () => void;
  isMobile: boolean;
}

const ConversationView = ({
  conversation,
  groupedMessages,
  onSendMessage,
  onBackToList,
  isMobile,
}: ConversationViewProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [groupedMessages]);

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        conversation={conversation} 
        onBackToList={onBackToList} 
        isMobile={isMobile} 
      />
      
      <div className="flex-1 min-h-0 overflow-y-auto p-4 max-h-[350px]">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <MessageGroup 
            key={date} 
            date={date} 
            messages={messages} 
            avatarSrc={conversation.avatar} 
            avatarFallback={conversation.name.charAt(0)} 
          />
        ))}
        <div ref={messageEndRef} />
      </div>
      
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ConversationView;
