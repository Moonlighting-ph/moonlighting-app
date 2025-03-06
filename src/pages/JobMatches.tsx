
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobMatchingCard from '../components/JobMatchingCard';
import { getMoonlighterMatchScores } from '../services/matchingService';
import { toast } from 'sonner';

const JobMatches: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMoonlighterMatchScores();
        setMatches(data || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast('Failed to load your job matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  // Sort matches by score (highest first)
  const sortedMatches = [...matches].sort((a, b) => 
    (b.ai_match_score || 0) - (a.ai_match_score || 0)
  );

  // Group matches by category
  const excellentMatches = sortedMatches.filter(m => (m.ai_match_score || 0) >= 86);
  const goodMatches = sortedMatches.filter(m => (m.ai_match_score || 0) >= 61 && (m.ai_match_score || 0) < 86);
  const moderateMatches = sortedMatches.filter(m => (m.ai_match_score || 0) >= 31 && (m.ai_match_score || 0) < 61);
  const poorMatches = sortedMatches.filter(m => (m.ai_match_score || 0) < 31);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Your Job Matches</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              AI-powered matches based on your profile, experience, and job requirements.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading your matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-10">
              <p>You haven't applied to any jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {excellentMatches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-green-800">Excellent Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {excellentMatches.map(match => (
                      <JobMatchingCard
                        key={match.id}
                        matchScore={match.ai_match_score || 0}
                        jobTitle={match.jobs.title}
                        company={match.jobs.company}
                        specialization={match.jobs.specialization}
                        experienceLevel={match.jobs.experience_level}
                        appliedDate={match.applied_date}
                        status={match.status}
                        onClick={() => handleJobClick(match.job_id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {goodMatches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">Good Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goodMatches.map(match => (
                      <JobMatchingCard
                        key={match.id}
                        matchScore={match.ai_match_score || 0}
                        jobTitle={match.jobs.title}
                        company={match.jobs.company}
                        specialization={match.jobs.specialization}
                        experienceLevel={match.jobs.experience_level}
                        appliedDate={match.applied_date}
                        status={match.status}
                        onClick={() => handleJobClick(match.job_id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {moderateMatches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-yellow-800">Moderate Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moderateMatches.map(match => (
                      <JobMatchingCard
                        key={match.id}
                        matchScore={match.ai_match_score || 0}
                        jobTitle={match.jobs.title}
                        company={match.jobs.company}
                        specialization={match.jobs.specialization}
                        experienceLevel={match.jobs.experience_level}
                        appliedDate={match.applied_date}
                        status={match.status}
                        onClick={() => handleJobClick(match.job_id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {poorMatches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-red-800">Other Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {poorMatches.map(match => (
                      <JobMatchingCard
                        key={match.id}
                        matchScore={match.ai_match_score || 0}
                        jobTitle={match.jobs.title}
                        company={match.jobs.company}
                        specialization={match.jobs.specialization}
                        experienceLevel={match.jobs.experience_level}
                        appliedDate={match.applied_date}
                        status={match.status}
                        onClick={() => handleJobClick(match.job_id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default JobMatches;
