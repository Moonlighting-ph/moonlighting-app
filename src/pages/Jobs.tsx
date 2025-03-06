
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobBoard from '../components/JobBoard';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';

const Jobs: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // If we want to eventually restrict the jobs page to only authenticated users
  // Currently this is commented out since the PRD mentions a public job board
  /*
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  */

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Available Opportunities</h1>
          <JobBoard jobs={jobs} loading={loading} />
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
