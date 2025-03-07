
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { fetchMoonlighterApplications } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import ApplicationsStats from './moonlighter/ApplicationsStats';
import RecentApplicationsList from './moonlighter/RecentApplicationsList';
import JobRecommendations from './moonlighter/JobRecommendations';
import DashboardHeader from './moonlighter/dashboard/DashboardHeader';

const MoonlighterDashboardContent: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const applications = await fetchMoonlighterApplications(session.user.id);
        setRecentApplications(applications.slice(0, 3)); // Get only the 3 most recent
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  const handleFindJobs = () => {
    navigate('/jobs');
  };
  
  const handleViewApplications = () => {
    navigate('/moonlighter/applications');
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader onFindJobs={handleFindJobs} />
        
        <ApplicationsStats applications={recentApplications} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentApplicationsList 
            applications={recentApplications}
            loading={loading}
            onViewAllClick={handleViewApplications}
            onFindJobsClick={handleFindJobs}
          />
          
          <JobRecommendations />
        </div>
      </div>
    </section>
  );
};

export default MoonlighterDashboardContent;
