
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobBoard from '../components/JobBoard';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Jobs: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

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
        <JobBoard />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
