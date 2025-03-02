
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  });

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

        <div className="flex items-center space-x-2">
          <Switch
            id="urgent"
            checked={formData.urgent}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="urgent" className="cursor-pointer">Mark as Urgent</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Job Posting' : 'Post Job'}
      </Button>
    </form>
  );
};

export default JobPostingForm;
