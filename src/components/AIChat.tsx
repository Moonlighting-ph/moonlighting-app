
import React, { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AIChatProps {
  model?: 'gpt-4o' | 'gpt-4o-mini';
}

const AIChat: React.FC<AIChatProps> = ({ model = 'gpt-4o-mini' }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const { generateResponse, isLoading, error } = useOpenAI({ model });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }

    const result = await generateResponse(prompt);
    
    if (result) {
      setResponse(result);
    } else if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Response'}
        </Button>
      </form>

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Response:</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
