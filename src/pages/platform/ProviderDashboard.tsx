
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Briefcase, Calendar, Users, BarChart3 } from 'lucide-react';
import HospitalJobsLoading from '@/components/hospital/HospitalJobsLoading';

const ProviderDashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to professional dashboard if user is not a medical provider
    if (!loading && profile && profile.user_type !== 'medical_provider') {
      navigate('/platform');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return <HospitalJobsLoading />;
  }

  // Dashboard statistics (placeholder data)
  const stats = [
    { 
      title: 'Active Job Postings', 
      value: '12', 
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      action: () => navigate('/platform/hospital-jobs')
    },
    { 
      title: 'Pending Applications', 
      value: '28', 
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      action: () => navigate('/platform/applications')
    },
    { 
      title: 'Scheduled Interviews', 
      value: '8', 
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      action: () => navigate('/platform/calendar')
    },
    { 
      title: 'Total Hires', 
      value: '42', 
      icon: <BarChart3 className="h-5 w-5 text-amber-500" />,
      action: () => navigate('/platform/analytics')
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.company || 'Hospital Admin'}</h2>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your job postings and applications.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:bg-accent/5 transition-colors" onClick={stat.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent applications to display</p>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={() => navigate('/platform/hospital-jobs')}
              >
                Manage your job postings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start"
              onClick={() => navigate('/platform/hospital-jobs/new')}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
            <Button 
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/platform/hospital-profile')}
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              Update Hospital Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
