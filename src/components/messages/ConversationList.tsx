
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConversationType } from '@/types/messages';

interface ConversationListProps {
  conversations: ConversationType[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeConversation: ConversationType | null;
  onSelectConversation: (conversation: ConversationType) => void;
}

const ConversationList = ({
  conversations,
  searchTerm,
  setSearchTerm,
  activeConversation,
  onSelectConversation,
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                onClick={() => onSelectConversation(conversation)}
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
    </>
  );
};

export default ConversationList;
