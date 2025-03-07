
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { fetchMoonlighterApplications } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import ApplicationsStats from './moonlighter/ApplicationsStats';
import RecentApplicationsList from './moonlighter/RecentApplicationsList';
import JobRecommendations from './moonlighter/JobRecommendations';

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Moonlighter Dashboard</h2>
          <Button size="lg" variant="default" onClick={handleFindJobs}>Find Shifts</Button>
        </div>
        
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
