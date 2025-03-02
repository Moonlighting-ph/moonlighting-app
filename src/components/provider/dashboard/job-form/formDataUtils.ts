
import { JobFormData, InitialJobData } from './types';

export const initializeFormData = (initialData?: InitialJobData): JobFormData => {
  return {
    title: initialData?.title || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    requirementsText: initialData?.requirements?.join('\n') || '',
    benefitsText: initialData?.benefits?.join('\n') || '',
    urgent: initialData?.urgent || false,
    qualificationsText: initialData?.qualifications?.filter(q => !q.startsWith('#')).join('\n') || '',
    baseSalary: initialData?.compensation_details?.base_salary || '',
    benefitsValue: initialData?.compensation_details?.benefits_value || '',
    bonusStructure: initialData?.compensation_details?.bonus_structure || '',
    paymentFrequency: initialData?.compensation_details?.payment_frequency || 'Monthly',
  };
};

export const initializeTags = (initialData?: InitialJobData): string[] => {
  return initialData?.qualifications?.filter(q => q.startsWith('#')) || [];
};
