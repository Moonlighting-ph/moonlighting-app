
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Briefcase, MapPin, Calendar, Edit, Trash2, Eye } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  deadline: string;
  urgent: boolean;
  is_active: boolean;
}

interface HospitalJobCardProps {
  job: Job;
  onDelete: (jobId: string) => void;
  formatDate: (dateString: string) => string;
}

const HospitalJobCard: React.FC<HospitalJobCardProps> = ({ 
  job, 
  onDelete,
  formatDate 
}) => {
  const navigate = useNavigate();

  const handleViewJob = (jobId: string) => {
    navigate(`/platform/job/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/platform/hospital-jobs/edit/${jobId}`);
  };

  return (
    <Card key={job.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">{job.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{job.type}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0">
              {job.urgent && (
                <Badge variant="destructive" className="ml-2">Urgent</Badge>
              )}
              <Badge variant={job.is_active ? "default" : "outline"} className="ml-2">
                {job.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Deadline: {formatDate(job.deadline)}</span>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewJob(job.id)}
              >
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditJob(job.id)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDelete(job.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalJobCard;
