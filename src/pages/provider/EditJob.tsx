
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { fetchJobById, updateJob } from '@/services/jobService';
import { Job } from '@/types/job';
import { toast } from 'sonner';
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

const EditJob: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
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

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId || !session?.user?.id) {
        navigate('/provider');
        return;
      }

      try {
        setLoading(true);
        const jobData = await fetchJobById(jobId);
        
        if (!jobData) {
          toast.error('Job not found');
          navigate('/provider');
          return;
        }

        // Verify this job belongs to the logged-in provider
        if (jobData.provider_id !== session.user.id) {
          toast.error('You do not have permission to edit this job');
          navigate('/provider');
          return;
        }

        setJob(jobData);
        
        // Format the date for the input field
        let formattedDeadline = '';
        if (jobData.deadline) {
          const date = new Date(jobData.deadline);
          formattedDeadline = date.toISOString().split('T')[0];
        }

        setFormData({
          title: jobData.title || '',
          company: jobData.company || '',
          description: jobData.description || '',
          type: jobData.type || '',
          location: jobData.location || '',
          salary: jobData.salary || '',
          requirements: jobData.requirements?.length ? jobData.requirements : [''],
          responsibilities: jobData.responsibilities?.length ? jobData.responsibilities : [''],
          specialization: jobData.specialization || '',
          experience_level: jobData.experience_level || '',
          is_urgent: jobData.is_urgent || false,
          deadline: formattedDeadline
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        navigate('/provider');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, session, navigate]);

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
    
    if (!session?.user?.id || !jobId) {
      toast.error('You must be logged in to update a job');
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
      setSaving(true);
      
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
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined
      };

      await updateJob(jobId, jobData);
      toast.success('Job updated successfully!');
      navigate('/provider');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Loading job details...</p>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  if (!job) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Job not found or you don't have permission to edit it.</p>
          <Button onClick={() => navigate('/provider')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/provider')}
          >
            ← Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">Edit Job</h1>
          
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

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/provider')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default EditJob;
