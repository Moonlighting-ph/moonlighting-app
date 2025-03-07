
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ApplicationCard from './ApplicationCard';
import EmptyApplicationsList from './EmptyApplicationsList';

interface ApplicationsListProps {
  applications: JobApplication[];
  onViewDetails: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid') => void;
  statusUpdateLoading: string | null;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  onViewDetails,
  onUpdateStatus,
  statusUpdateLoading
}) => {
  if (!applications || applications.length === 0) {
    return <EmptyApplicationsList />;
  }

  return (
    <Card className="shadow-md border-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
                statusUpdateLoading={statusUpdateLoading}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
