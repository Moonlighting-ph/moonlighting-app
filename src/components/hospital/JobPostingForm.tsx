
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { X, Plus, StarIcon, Tag, DollarSign, Clock, Briefcase, FileText } from 'lucide-react';

interface JobPostingFormProps {
  initialData?: {
    id?: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    deadline: string;
    description: string;
    requirements: string[];
    benefits: string[];
    urgent: boolean;
    qualifications?: string[];
    compensation_details?: {
      base_salary?: string;
      benefits_value?: string;
      bonus_structure?: string;
      payment_frequency?: string;
    };
  };
  onSuccess?: () => void;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  initialData,
  onSuccess 
}) => {
  const isEditing = !!initialData?.id;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    requirementsText: initialData?.requirements?.join('\n') || '',
    benefitsText: initialData?.benefits?.join('\n') || '',
    urgent: initialData?.urgent || false,
    qualificationsText: initialData?.qualifications?.join('\n') || '',
    baseSalary: initialData?.compensation_details?.base_salary || '',
    benefitsValue: initialData?.compensation_details?.benefits_value || '',
    bonusStructure: initialData?.compensation_details?.bonus_structure || '',
    paymentFrequency: initialData?.compensation_details?.payment_frequency || 'Monthly',
  });

  const [tags, setTags] = useState<string[]>(
    initialData?.qualifications?.filter(q => q.startsWith('#')) || []
  );
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      urgent: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(`#${newTag.trim()}`)) {
      setTags([...tags, `#${newTag.trim()}`]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to post a job",
          variant: "destructive",
        });
        return;
      }

      // Get user profile to get company info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company,id')
        .eq('id', userData.user.id)
        .single();

      if (profileError || !profileData.company) {
        toast({
          title: "Profile Error",
          description: "Please complete your hospital profile first",
          variant: "destructive",
        });
        return;
      }

      const requirements = formData.requirementsText
        .split('\n')
        .filter(line => line.trim() !== '');
      
      const benefits = formData.benefitsText
        .split('\n')
        .filter(line => line.trim() !== '');
        
      const qualifications = [
        ...formData.qualificationsText
          .split('\n')
          .filter(line => line.trim() !== ''),
        ...tags
      ];

      // Get company logo (placeholder for now)
      const logo = "https://placehold.co/600x400/png"; // Default placeholder

      const jobData = {
        title: formData.title,
        company: profileData.company,
        logo: logo,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        deadline: new Date(formData.deadline).toISOString(),
        description: formData.description,
        requirements,
        benefits,
        urgent: formData.urgent,
        created_by: userData.user.id,
        qualifications,
        compensation_details: {
          base_salary: formData.baseSalary,
          benefits_value: formData.benefitsValue,
          bonus_structure: formData.bonusStructure,
          payment_frequency: formData.paymentFrequency,
        }
      };

      let result;
      
      if (isEditing && initialData?.id) {
        // Update existing job
        result = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id)
          .eq('created_by', userData.user.id); // Ensure job belongs to this user
      } else {
        // Create new job
        result = await supabase
          .from('jobs')
          .insert([jobData])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Job Updated" : "Job Posted",
        description: isEditing 
          ? "Your job posting has been updated successfully." 
          : "Your job has been posted successfully.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/platform/hospital-jobs');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'post'} job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title*</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Registered Nurse, ICU"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location*</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Manila, Philippines"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Job Type*</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Locum">Locum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline*</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description*</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the job role and responsibilities..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
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
                  value={formData.qualificationsText}
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
          
          <AccordionItem value="requirements">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" /> Job Requirements
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="requirementsText">Requirements (one per line)</Label>
                <Textarea
                  id="requirementsText"
                  name="requirementsText"
                  placeholder="Enter job requirements, one per line..."
                  value={formData.requirementsText}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="compensation">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" /> Compensation Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range*</Label>
                    <Input
                      id="salary"
                      name="salary"
                      placeholder="e.g., ₱20,000 - ₱25,000 per month"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="baseSalary">Base Salary</Label>
                      <Input
                        id="baseSalary"
                        name="baseSalary"
                        placeholder="e.g., ₱20,000"
                        value={formData.baseSalary}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="benefitsValue">Benefits Value</Label>
                      <Input
                        id="benefitsValue"
                        name="benefitsValue"
                        placeholder="e.g., ₱5,000"
                        value={formData.benefitsValue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                      <Select
                        value={formData.paymentFrequency}
                        onValueChange={(value) => handleSelectChange('paymentFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Bi-monthly">Bi-monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bonusStructure">Bonus Structure</Label>
                      <Input
                        id="bonusStructure"
                        name="bonusStructure"
                        placeholder="e.g., Performance-based bonuses"
                        value={formData.bonusStructure}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="benefits">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" /> Benefits
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="benefitsText">Benefits (one per line)</Label>
                <Textarea
                  id="benefitsText"
                  name="benefitsText"
                  placeholder="Enter job benefits, one per line..."
                  value={formData.benefitsText}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center space-x-2 pt-4">
          <Tag className="h-5 w-5 text-destructive" />
          <Label htmlFor="urgent" className="cursor-pointer font-medium">Mark as Urgent</Label>
          <Switch
            id="urgent"
            checked={formData.urgent}
            onCheckedChange={handleSwitchChange}
          />
          {formData.urgent && (
            <Badge variant="destructive">Urgent</Badge>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Job Posting' : 'Post Job'}
      </Button>
    </form>
  );
};

export default JobPostingForm;
