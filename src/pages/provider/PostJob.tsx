
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import JobPostForm from '@/components/provider/JobPostForm';
import { Job } from '@/types/job';

const PostJobPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleJobPostSuccess = (job: Job) => {
    setIsSubmitted(true);
    // Redirect to the job detail page after a short delay
    setTimeout(() => {
      navigate(`/jobs/${job.id}`);
    }, 1500);
  };

  if (!session) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Please sign in to post a new job.</p>
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
          {isSubmitted ? (
            <div className="bg-green-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Job Posted Successfully!</h2>
              <p className="text-green-700 mb-4">Your job has been posted and is now visible to potential applicants.</p>
              <p className="text-sm text-green-600">Redirecting you to the job detail page...</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
              <JobPostForm onSuccess={handleJobPostSuccess} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default PostJobPage;
