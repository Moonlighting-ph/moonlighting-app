
import React from 'react';
import MessageBubble from './MessageBubble';
import { MessageType } from '@/types/messages';

interface MessageGroupProps {
  date: string;
  messages: MessageType[];
  avatarSrc: string;
  avatarFallback: string;
}

const MessageGroup = ({ date, messages, avatarSrc, avatarFallback }: MessageGroupProps) => {
  return (
    <div>
      <div className="text-center mb-2">
        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
          {date}
        </span>
      </div>
      <div className="space-y-4 mb-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            avatarSrc={avatarSrc} 
            avatarFallback={avatarFallback} 
          />
        ))}
      </div>
    </div>
  );
};

export default MessageGroup;
