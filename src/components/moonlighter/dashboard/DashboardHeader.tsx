
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onFindJobs: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onFindJobs }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Moonlighter Dashboard</h2>
      <Button size="lg" variant="default" onClick={onFindJobs}>Find Shifts</Button>
    </div>
  );
};

export default DashboardHeader;
