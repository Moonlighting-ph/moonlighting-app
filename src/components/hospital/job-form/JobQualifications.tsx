
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StarIcon, X, Plus } from 'lucide-react';

interface JobQualificationsProps {
  qualificationsText: string;
  tags: string[];
  newTag: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setNewTag: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const JobQualifications: React.FC<JobQualificationsProps> = ({
  qualificationsText,
  tags,
  newTag,
  handleChange,
  setNewTag,
  addTag,
  removeTag
}) => {
  return (
    <AccordionItem value="qualifications">
      <AccordionTrigger className="text-base font-medium">
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 mr-2" /> Required Qualifications
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="qualificationsText">Qualifications (one per line)</Label>
          <Textarea
            id="qualificationsText"
            name="qualificationsText"
            placeholder="Enter required qualifications, one per line..."
            value={qualificationsText}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Qualification Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag (e.g. RN, LPN)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button 
              type="button" 
              onClick={addTag}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobQualifications;
