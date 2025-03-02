
import React from 'react';

const EmptyConversation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="max-w-md text-center">
        <h3 className="text-lg font-medium mb-2">select a conversation</h3>
        <p className="text-sm text-muted-foreground">
          choose a conversation from the list to start messaging.
        </p>
      </div>
    </div>
  );
};

export default EmptyConversation;
