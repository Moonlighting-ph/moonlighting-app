
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageType } from '@/types/messages';

interface MessageBubbleProps {
  message: MessageType;
  avatarSrc: string;
  avatarFallback: string;
}

const MessageBubble = ({ message, avatarSrc, avatarFallback }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex gap-2 max-w-[80%]">
        {message.sender === 'them' && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={avatarSrc} alt={avatarFallback} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <div
            className={`rounded-lg px-3 py-2 text-sm ${
              message.sender === 'me'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            {message.content}
          </div>
          <div className="flex items-center mt-1 gap-1">
            <span className="text-[10px] text-muted-foreground">{message.time}</span>
            {message.sender === 'me' &&
              (message.read ? (
                <CheckCheck className="h-3 w-3 text-primary" />
              ) : (
                <Check className="h-3 w-3 text-muted-foreground" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
