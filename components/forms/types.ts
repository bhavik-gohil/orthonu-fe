/**
 * TypeScript interfaces for Contact & Partnership Forms
 * Defines all data structures, error states, and API responses
 */

/**
 * Contact form data structure
 * Represents all fields collected from the Contact Us form
 */
export interface ContactFormData {
  name: string;
  email: string;
  city: string;
  state: string;
  phone: string;
  organization: string;
  message: string;
  requestType: "Contact OrthoNu Consultant" | "Customer Service" | "General Inquiry";
  consentGiven: boolean;
}

/**
 * Partner form data structure
 * Represents all fields collected from the Partner With Us form
 */
export interface PartnerFormData {
  name: string;
  organization: string;
  workEmail: string;
  numberOfLocations: number;
  needs: string;
}

/**
 * Form errors structure
 * Maps field names to error messages
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Contact form submission payload
 * Extends ContactFormData with submission timestamp
 */
export interface ContactFormSubmission extends ContactFormData {
  submittedAt: string; // ISO 8601 timestamp
}

/**
 * Partner form submission payload
 * Extends PartnerFormData with submission timestamp
 */
export interface PartnerFormSubmission extends PartnerFormData {
  submittedAt: string; // ISO 8601 timestamp
}

/**
 * Successful API response structure
 */
export interface FormSubmissionResponse {
  success: true;
  message: string;
  submissionId: string;
}

/**
 * Error API response structure
 */
export interface FormSubmissionError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

/**
 * Union type for API responses
 */
export type FormSubmissionResult = FormSubmissionResponse | FormSubmissionError;

/**
 * Props for ContactUsForm component
 */
export interface ContactUsFormProps {
  onSubmitSuccess?: (data: ContactFormData) => void;
  onSubmitError?: (error: string) => void;
  className?: string;
  submitButtonText?: string;
  successMessageDuration?: number; // milliseconds, default 3000
}

/**
 * Props for PartnerWithUsForm component
 */
export interface PartnerWithUsFormProps {
  onSubmitSuccess?: (data: PartnerFormData) => void;
  onSubmitError?: (error: string) => void;
  className?: string;
  submitButtonText?: string;
  successMessageDuration?: number; // milliseconds, default 3000
}
