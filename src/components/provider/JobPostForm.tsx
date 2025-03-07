
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Job } from '@/types/job';
import { createJob } from '@/services/jobService';

interface JobPostFormProps {
  onSuccess?: (job: Job) => void;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ onSuccess }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: '',
    location: '',
    salary: '',
    requirements: [''],
    responsibilities: [''],
    specialization: '',
    experience_level: '',
    is_urgent: false,
    deadline: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_urgent: checked }));
  };

  const handleListChange = (type: 'requirements' | 'responsibilities', index: number, value: string) => {
    const newList = [...formData[type]];
    newList[index] = value;
    setFormData(prev => ({ ...prev, [type]: newList }));
  };

  const addListItem = (type: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({ 
      ...prev, 
      [type]: [...prev[type], ''] 
    }));
  };

  const removeListItem = (type: 'requirements' | 'responsibilities', index: number) => {
    if (formData[type].length <= 1) return;
    const newList = formData[type].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: newList }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to post a job');
      return;
    }

    // Basic validation
    if (!formData.title || !formData.company || !formData.description || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty list items
    const requirements = formData.requirements.filter(item => item.trim() !== '');
    const responsibilities = formData.responsibilities.filter(item => item.trim() !== '');

    try {
      setLoading(true);
      
      const jobData: Partial<Job> = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        type: formData.type,
        location: formData.location || undefined,
        salary: formData.salary || undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
        specialization: formData.specialization || undefined,
        experience_level: formData.experience_level || undefined,
        is_urgent: formData.is_urgent,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        provider_id: session.user.id
      };

      const newJob = await createJob(jobData);
      toast.success('Job posted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        type: '',
        location: '',
        salary: '',
        requirements: [''],
        responsibilities: [''],
        specialization: '',
        experience_level: '',
        is_urgent: false,
        deadline: ''
      });

      if (onSuccess) {
        onSuccess(newJob);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Emergency Room Nurse"
                required
              />
            </div>

            <div>
              <Label htmlFor="company">Healthcare Facility <span className="text-red-500">*</span></Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Metro General Hospital"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job role, duties, and expectations..."
                className="min-h-[100px] resize-y"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Job Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Select 
                  value={formData.specialization} 
                  onValueChange={(value) => handleSelectChange('specialization', value)}
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select 
                  value={formData.experience_level} 
                  onValueChange={(value) => handleSelectChange('experience_level', value)}
                >
                  <SelectTrigger id="experience_level">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Experienced">Experienced</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Manila, Philippines"
                />
              </div>

              <div>
                <Label htmlFor="salary">Salary/Rate</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., ₱5,000 per shift"
                />
              </div>

              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label>Requirements</Label>
              {formData.requirements.map((req, index) => (
                <div key={`req-${index}`} className="flex gap-2 mt-2">
                  <Input
                    value={req}
                    onChange={(e) => handleListChange('requirements', index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeListItem('requirements', index)}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => addListItem('requirements')}
              >
                Add Requirement
              </Button>
            </div>

            <div>
              <Label>Responsibilities</Label>
              {formData.responsibilities.map((resp, index) => (
                <div key={`resp-${index}`} className="flex gap-2 mt-2">
                  <Input
                    value={resp}
                    onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeListItem('responsibilities', index)}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => addListItem('responsibilities')}
              >
                Add Responsibility
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_urgent" 
                checked={formData.is_urgent}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_urgent" className="cursor-pointer">
                Mark as Urgent Position
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
