
import React from 'react';
import { Button } from '@/components/ui/button';

interface MoonlighterActionsProps {
  onApply: () => void;
}

const MoonlighterActions: React.FC<MoonlighterActionsProps> = ({ onApply }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border">
      <h3 className="text-lg font-medium mb-2">Ready to Apply?</h3>
      <p className="text-gray-500 mb-4">
        Submit your application for this position and the healthcare provider will review your profile.
      </p>
      <Button 
        onClick={onApply} 
        className="w-full"
      >
        Apply Now
      </Button>
    </div>
  );
};

export default MoonlighterActions;
