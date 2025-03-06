
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseOpenAIOptions {
  model?: 'gpt-4o' | 'gpt-4o-mini';
}

export function useOpenAI(options: UseOpenAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          prompt,
          model: options.model || 'gpt-4o-mini',
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.answer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate response';
      setError(errorMessage);
      console.error('OpenAI error:', errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
  };
}
