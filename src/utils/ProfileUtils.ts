
import { Profile } from "@/types/profile";

/**
 * Calculates the profile completion percentage based on filled fields
 */
export const calculateCompletionPercentage = (
  formData: Record<string, any>,
  userType?: string
): number => {
  let filledFields = 0;
  let totalFields = 0;
  
  const basicFields = ['first_name', 'last_name', 'title', 'bio', 'avatar_url'];
  basicFields.forEach(field => {
    totalFields++;
    if (formData[field] && String(formData[field]).trim() !== '') {
      filledFields++;
    }
  });
  
  const contactFields = ['contact_email', 'phone'];
  contactFields.forEach(field => {
    totalFields++;
    if (formData[field] && String(formData[field]).trim() !== '') {
      filledFields++;
    }
  });
  
  if (userType === 'medical_professional') {
    const professionalFields = ['prc_license', 'work_experience', 'preferred_location'];
    professionalFields.forEach(field => {
      totalFields++;
      if (formData[field] && String(formData[field]).trim() !== '') {
        filledFields++;
      }
    });
    
    const documentFields = ['prc_license', 'tin_number', 'government_id'];
    documentFields.forEach(field => {
      totalFields++;
      if (formData[field] && String(formData[field]).trim() !== '') {
        filledFields++;
      }
    });
  } else if (userType === 'medical_provider') {
    const providerFields = ['company', 'company_address', 'facility_type', 'prc_license'];
    providerFields.forEach(field => {
      totalFields++;
      if (formData[field] && String(formData[field]).trim() !== '') {
        filledFields++;
      }
    });
  }
  
  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Checks if document verification is complete
 */
export const isDocumentVerificationComplete = (
  documentStatus: string,
  prcLicense?: string,
  tinNumber?: string,
  governmentId?: string
): boolean => {
  return (
    documentStatus === "verified" ||
    (!!prcLicense && !!tinNumber && !!governmentId)
  );
};

/**
 * Initializes form data from profile
 */
export const initializeFormDataFromProfile = (
  profile: Profile | null,
  userEmail?: string | null
): {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  contact_email: string;
  phone: string;
  company: string;
  company_address: string;
  facility_type: string;
  avatar_url: string;
  prc_license: string;
  work_experience: string;
  preferred_location: string;
  tin_number: string;
  government_id: string;
  document_verification_status: "pending" | "submitted" | "verified" | "rejected";
} => {
  if (profile) {
    return {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      contact_email: profile.contact_email || userEmail || "",
      phone: profile.phone || "",
      company: profile.company || "",
      company_address: profile.company_address || "",
      facility_type: profile.facility_type || "",
      avatar_url: profile.avatar_url || "",
      prc_license: profile.prc_license || "",
      work_experience: profile.work_experience || "",
      preferred_location: profile.preferred_location || "",
      tin_number: profile.tin_number || "",
      government_id: profile.government_id || "",
      document_verification_status: 
        (profile.document_verification_status as "pending" | "submitted" | "verified" | "rejected") || "pending",
    };
  }
  
  return {
    first_name: "",
    last_name: "",
    title: "",
    bio: "",
    contact_email: userEmail || "",
    phone: "",
    company: "",
    company_address: "",
    facility_type: "",
    avatar_url: "",
    prc_license: "",
    work_experience: "",
    preferred_location: "",
    tin_number: "",
    government_id: "",
    document_verification_status: "pending",
  };
};
