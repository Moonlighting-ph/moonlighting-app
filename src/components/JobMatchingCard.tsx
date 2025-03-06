
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface JobMatchingCardProps {
  matchScore: number;
  jobTitle: string;
  company: string;
  specialization?: string;
  experienceLevel?: string;
  appliedDate: string;
  status: string;
  onClick?: () => void;
}

const JobMatchingCard: React.FC<JobMatchingCardProps> = ({
  matchScore,
  jobTitle,
  company,
  specialization,
  experienceLevel,
  appliedDate,
  status,
  onClick,
}) => {
  // Determine match category and color
  const getMatchCategory = (score: number) => {
    if (score >= 86) return { category: 'Excellent', color: 'bg-green-500' };
    if (score >= 61) return { category: 'Good', color: 'bg-blue-500' };
    if (score >= 31) return { category: 'Moderate', color: 'bg-yellow-500' };
    return { category: 'Poor', color: 'bg-red-500' };
  };

  const { category, color } = getMatchCategory(matchScore);

  return (
    <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{jobTitle}</CardTitle>
            <CardDescription>{company}</CardDescription>
          </div>
          <Badge
            variant={status === 'pending' ? 'outline' : status === 'accepted' ? 'default' : 'destructive'}
            className="ml-2"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Match Score: {matchScore}%</span>
              <span className="text-sm font-medium">{category}</span>
            </div>
            <Progress value={matchScore} className={color} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {specialization && <Badge variant="outline">{specialization}</Badge>}
            {experienceLevel && <Badge variant="secondary">{experienceLevel}</Badge>}
          </div>
          
          <p className="text-xs text-gray-500">
            Applied on {new Date(appliedDate).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-400">
          AI-powered match based on your profile and job requirements
        </p>
      </CardFooter>
    </Card>
  );
};

export default JobMatchingCard;
