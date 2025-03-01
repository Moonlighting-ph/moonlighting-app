export const formatJobDeadline = (deadline: string): string => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Last day to apply';
  if (diffDays === 1) return '1 day left';
  if (diffDays <= 7) return `${diffDays} days left`;
  
  return `Apply by ${deadlineDate.toLocaleDateString()}`;
};

/**
 * Formats a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
