
export interface CompensationDetails {
  base_salary?: string;
  benefits_value?: string;
  bonus_structure?: string;
  payment_frequency?: string;
}

export interface JobFormData {
  title: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirementsText: string;
  benefitsText: string;
  urgent: boolean;
  qualificationsText: string;
  baseSalary: string;
  benefitsValue: string;
  bonusStructure: string;
  paymentFrequency: string;
}

export interface InitialJobData {
  id?: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent: boolean;
  qualifications?: string[];
  compensation_details?: CompensationDetails;
}

export interface JobFormState {
  formData: JobFormData;
  tags: string[];
  newTag: string;
  isSubmitting: boolean;
  isEditing: boolean;
}

export interface JobFormHandlers {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  addTag: () => void;
  removeTag: (tagToRemove: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setNewTag: (value: string) => void;
}
