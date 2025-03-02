
import React from 'react';
import { MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ConversationType } from '@/types/messages';

interface ConversationHeaderProps {
  conversation: ConversationType;
  onBackToList: () => void;
  isMobile: boolean;
}

const ConversationHeader = ({ conversation, onBackToList, isMobile }: ConversationHeaderProps) => {
  return (
    <div className="p-3 md:p-4 border-b flex items-center justify-between bg-background z-10">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBackToList} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{conversation.name}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="truncate">
              {conversation.role} • {conversation.company}
            </span>
            {conversation.status === 'online' && (
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
  );
};

export default ConversationHeader;
