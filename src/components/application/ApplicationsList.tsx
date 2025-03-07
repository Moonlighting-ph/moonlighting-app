
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ApplicationCard from './ApplicationCard';
import { Check, Clock, AlertCircle, Users } from 'lucide-react';

interface ApplicationsListProps {
  applications: JobApplication[];
  onViewDetails: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => void;
  statusUpdateLoading: string | null;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  onViewDetails,
  onUpdateStatus,
  statusUpdateLoading
}) => {
  if (!applications || applications.length === 0) {
    return null;
  }

  // Group applications by status
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const reviewedCount = applications.filter(app => app.status === 'reviewed').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  const paidCount = applications.filter(app => app.status === 'paid').length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Applications received
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingCount === 1 ? 'Application' : 'Applications'} awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount + paidCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidCount > 0 && `${paidCount} paid, `}
              {approvedCount > 0 && `${approvedCount} unpaid`}
              {approvedCount === 0 && paidCount === 0 && 'No approved applications'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {rejectedCount === 1 ? 'Application' : 'Applications'} not selected
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border rounded-lg shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b px-6 py-4">
          <CardTitle className="text-lg font-medium">Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[250px]">Applicant</TableHead>
                <TableHead className="w-[220px]">Job</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
    </div>
  );
};

export default ApplicationsList;
