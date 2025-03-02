
import React, { useState } from 'react';
import { Send, Paperclip, ImageIcon, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
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
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
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
  );
};

export default MessageInput;
