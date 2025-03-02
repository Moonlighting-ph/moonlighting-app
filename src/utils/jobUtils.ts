
import { formatJobDeadline } from './formatters';

/**
 * Formats a date string to a localized date string
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

// Re-export formatJobDeadline for consistency
export { formatJobDeadline };
