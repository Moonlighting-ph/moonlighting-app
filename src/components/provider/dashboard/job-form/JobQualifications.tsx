
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobQualificationsProps {
  qualificationsText: string;
  tags: string[];
  newTag: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  removeTag,
}) => {
  return (
    <AccordionItem value="qualifications">
      <AccordionTrigger className="py-4">Qualifications & Requirements</AccordionTrigger>
      <AccordionContent className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="qualificationsText">Required Qualifications</Label>
          <Textarea
            id="qualificationsText"
            name="qualificationsText"
            value={qualificationsText}
            onChange={handleChange}
            placeholder="List education, experience, certifications required (each on a new line)..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter each qualification on a new line. For example: "Bachelor's degree in Nursing"
          </p>
        </div>

        <div className="space-y-2">
          <Label>Skill Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="max-w-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add Tag
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Add relevant skills as tags for better discovery (e.g., NICU, ICU, Oncology)
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobQualifications;
