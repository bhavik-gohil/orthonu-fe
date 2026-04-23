"use client";

import React, { useState, ChangeEvent, FormEvent, JSX } from "react";
import { ContactFormData, ContactUsFormProps, FormErrors } from "./types";
import { apiCall } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import {
  validateEmail,
  validatePhone,
  validateMessageLength,
  validateRequired,
  validateCheckbox,
  validateSelect,
} from "@/lib/formValidation";

/**
 * ContactUsForm Component
 *
 * A standalone, reusable form component for collecting customer inquiries and support requests.
 * Manages form state, validation, and submission with comprehensive error handling.
 *
 * @component
 * @param {ContactUsFormProps} props - Component props
 * @param {Function} [props.onSubmitSuccess] - Callback fired when form submission succeeds
 * @param {Function} [props.onSubmitError] - Callback fired when form submission fails
 * @param {string} [props.className] - Additional CSS classes for the form container
 * @param {string} [props.submitButtonText] - Custom text for the submit button (default: "Submit")
 * @param {number} [props.successMessageDuration] - Duration in milliseconds to display success message (default: 3000)
 * @returns {JSX.Element} The rendered form component
 *
 * @example
 * ```tsx
 * <ContactUsForm
 *   onSubmitSuccess={(data) => console.log('Form submitted:', data)}
 *   onSubmitError={(error) => console.error('Form error:', error)}
 *   submitButtonText="Send Inquiry"
 * />
 * ```
 */
export default function ContactUsForm({
  onSubmitSuccess,
  onSubmitError,
  className = "",
  submitButtonText = "Submit",
  successMessageDuration = 3000,
}: ContactUsFormProps): JSX.Element {
  // ============================================================================
  // State Management
  // ============================================================================

  /**
   * Form data state - stores all 9 form field values
   * Initialized with empty strings and false for checkbox
   */
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    city: "",
    state: "",
    phone: "",
    organization: "",
    message: "",
    requestType: "Contact OrthoNu Consultant",
    consentGiven: false,
  });

  /**
   * Error state - maps field names to error messages
   * Initialized as empty object (no errors)
   */
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Loading state - indicates form submission is in progress
   * Used to disable submit button and show loading indicator
   */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Success state - indicates form submission was successful
   * Used to display success message and reset form after delay
   */
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // ============================================================================
  // Validation Functions
  // ============================================================================

  /**
   * Validates all 9 form fields
   * Returns true if all fields are valid, false if any field is invalid
   * Sets errors state with field-specific error messages
   * Returns early if any field is invalid
   *
   * @returns {boolean} true if all fields are valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Name (required, non-empty)
    if (!validateRequired(formData.name)) {
      newErrors.name = "Name is required";
    }

    // Validate Email (required, valid email format)
    if (!validateRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate City (required, non-empty)
    if (!validateRequired(formData.city)) {
      newErrors.city = "City is required";
    }

    // Validate State (required, non-empty)
    if (!validateRequired(formData.state)) {
      newErrors.state = "State is required";
    }

    // Validate Phone (required, valid phone format - 10+ digits)
    if (!validateRequired(formData.phone)) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Validate Organization (required, non-empty)
    if (!validateRequired(formData.organization)) {
      newErrors.organization = "Organization or Practice Name is required";
    }

    // Validate Message (required, minimum 10 characters)
    if (!validateRequired(formData.message)) {
      newErrors.message = "Message is required";
    } else if (!validateMessageLength(formData.message)) {
      newErrors.message = "Message must be at least 10 characters";
    }

    // Validate Request Type (required, one of the 3 options)
    const validRequestTypes = [
      "Contact OrthoNu Consultant",
      "Customer Service",
      "General Inquiry",
    ];
    if (!validateSelect(formData.requestType, validRequestTypes)) {
      newErrors.requestType = "Please select a request type";
    }

    // Validate Consent (required, must be checked)
    if (!validateCheckbox(formData.consentGiven)) {
      newErrors.consentGiven = "You must agree to be contacted";
    }

    // Set errors state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form field changes
   * Updates form data state and clears field error on change
   * Provides real-time feedback by clearing errors as user corrects them
   *
   * @param {ChangeEvent} e - Change event from input, textarea, or select element
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value, type } = e.target;

    // Handle checkbox separately (checked property instead of value)
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      // Clear error for this field when user interacts with it
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    } else {
      // Handle text inputs, textareas, and selects
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user interacts with it
      // Also clear submit error to allow retry
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        submit: undefined,
      }));
    }
  };

  /**
   * Handles form field changes for Input component
   * Updates form data state and clears field error on change
   *
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleInputChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user interacts with it
    // Also clear submit error to allow retry
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      submit: undefined,
    }));
  };

  /**
   * Resets form to initial empty state
   * Clears all form fields, errors, and loading states
   * Called after successful submission
   */
  const resetForm = (): void => {
    setFormData({
      name: "",
      email: "",
      city: "",
      state: "",
      phone: "",
      organization: "",
      message: "",
      requestType: "Contact OrthoNu Consultant",
      consentGiven: false,
    });
    setErrors({});
    setIsSubmitting(false);
  };

  /**
   * Handles form submission
   * Validates all fields, collects data, and submits to backend
   * Displays success message for 3 seconds before resetting form
   * Handles network failures, timeouts, and backend validation errors
   *
   * @param {FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Set loading state and clear any previous errors
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare payload with timestamp
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      // Submit form data to backend using common API client
      const response = await apiCall("POST", "/api/forms/contact", payload);

      // Display success message
      setSuccessMessage(true);

      // Reset form fields
      resetForm();

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }

      // Hide success message after specified duration
      setTimeout(() => {
        setSuccessMessage(false);
      }, successMessageDuration);
    } catch (error: any) {
      // Handle API errors
      let errorMessage = "An error occurred. Please try again.";
      let backendErrors = {};

      if (error.response) {
        // API responded with an error status
        const errorData = error.response.data;

        if (errorData.message) {
          errorMessage = errorData.message;
        }

        if (errorData.errors) {
          backendErrors = errorData.errors;
        }

        // Handle specific status codes
        if (error.response.status >= 500) {
          errorMessage =
            "An error occurred while processing your request. Please try again later.";
        } else if (error.response.status === 400) {
          errorMessage =
            errorData.message || "Please check your information and try again.";
        }
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("timeout")
      ) {
        // Timeout error
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes("Network Error") || !error.response) {
        // Network failure
        errorMessage =
          "Unable to submit form. Please check your connection and try again.";
      }

      // If backend returned field-specific errors, display them
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        // Display general error message
        setErrors({ submit: errorMessage });
      }

      // Call error callback if provided
      if (onSubmitError) {
        onSubmitError(errorMessage);
      }

      // Reset loading state to allow retry
      setIsSubmitting(false);
    }
  };

  /**
   * Validates a single field on blur
   * Updates errors state for that field only
   * Provides real-time feedback to user
   *
   * @param {string} fieldName - Name of the field being validated
   */
  const handleBlur = (fieldName: keyof ContactFormData): void => {
    const newErrors = { ...errors };
    let hasError = false;

    switch (fieldName) {
      case "name":
        if (!validateRequired(formData.name)) {
          newErrors.name = "Name is required";
          hasError = true;
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!validateRequired(formData.email)) {
          newErrors.email = "Email is required";
          hasError = true;
        } else if (!validateEmail(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          hasError = true;
        } else {
          delete newErrors.email;
        }
        break;

      case "city":
        if (!validateRequired(formData.city)) {
          newErrors.city = "City is required";
          hasError = true;
        } else {
          delete newErrors.city;
        }
        break;

      case "state":
        if (!validateRequired(formData.state)) {
          newErrors.state = "State is required";
          hasError = true;
        } else {
          delete newErrors.state;
        }
        break;

      case "phone":
        if (!validateRequired(formData.phone)) {
          newErrors.phone = "Phone is required";
          hasError = true;
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number";
          hasError = true;
        } else {
          delete newErrors.phone;
        }
        break;

      case "organization":
        if (!validateRequired(formData.organization)) {
          newErrors.organization = "Organization or Practice Name is required";
          hasError = true;
        } else {
          delete newErrors.organization;
        }
        break;

      case "message":
        if (!validateRequired(formData.message)) {
          newErrors.message = "Message is required";
          hasError = true;
        } else if (!validateMessageLength(formData.message)) {
          newErrors.message = "Message must be at least 10 characters";
          hasError = true;
        } else {
          delete newErrors.message;
        }
        break;

      case "requestType":
        const validRequestTypes = [
          "Contact OrthoNu Consultant",
          "Customer Service",
          "General Inquiry",
        ];
        if (!validateSelect(formData.requestType, validRequestTypes)) {
          newErrors.requestType = "Please select a request type";
          hasError = true;
        } else {
          delete newErrors.requestType;
        }
        break;

      case "consentGiven":
        if (!validateCheckbox(formData.consentGiven)) {
          newErrors.consentGiven = "You must agree to be contacted";
          hasError = true;
        } else {
          delete newErrors.consentGiven;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // ============================================================================
  // Component Structure
  // ============================================================================

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-4xl contact-form ${className} bg-white p-4 md:p-8 rounded-3xl border border-brand-blue/30`}
    >
      {/* Error Banner - displays at top when submission fails */}
      {errors.submit && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg"
          role="alert"
          aria-live="assertive"
          aria-label="Form submission error"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-red-800 font-semibold">{errors.submit}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrors({ ...errors, submit: undefined })}
              className="ml-4 text-red-600 hover:text-red-800 transition-colors"
              aria-label="Dismiss error message"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          <p className="text-red-700 text-sm mt-2">
            You can modify your information and try submitting again.
          </p>
        </div>
      )}

      {/* Form Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-soft-dark">Contact Us</h1>
        <p className="md:text-sm text-soft-dark/70">
          Let us know how we can help you!
        </p>
      </div>

      {/* Form Fields Section */}
      <div className="gap-4 grid md:grid-cols-2">
        {/* Name Field */}
        <Input
          label="Name"
          value={formData.name}
          onChange={(value) => handleInputChange("name", value)}
          required={true}
          name="name"
          type="text"
          note={errors.name}
          className={errors.name ? "text-red-600" : ""}
        />

        {/* Email Field */}
        <Input
          label="Email"
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
          required={true}
          name="email"
          type="email"
          note={errors.email}
          className={errors.email ? "text-red-600" : ""}
        />

        {/* City Field */}
        <Input
          label="City"
          value={formData.city}
          onChange={(value) => handleInputChange("city", value)}
          required={true}
          name="city"
          type="text"
          note={errors.city}
          className={errors.city ? "text-red-600" : ""}
        />

        {/* State Field */}
        <Input
          label="State"
          value={formData.state}
          onChange={(value) => handleInputChange("state", value)}
          required={true}
          name="state"
          type="text"
          note={errors.state}
          className={errors.state ? "text-red-600" : ""}
        />

        {/* Phone Field */}
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value)}
          required={true}
          name="phone"
          type="tel"
          note={errors.phone}
          className={errors.phone ? "text-red-600" : ""}
        />

        {/* Organization Field */}
        <Input
          label="Organization or Practice Name"
          value={formData.organization}
          onChange={(value) => handleInputChange("organization", value)}
          required={true}
          name="organization"
          type="text"
          note={errors.organization}
          className={errors.organization ? "text-red-600" : ""}
        />
      </div>

      <div className="space-y-4 mt-4">
        {/* Message Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold  tracking-wide text-soft-dark/50 px-1">
            Message
          </label>
          <div className="relative group">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur("message")}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              rows={5}
              className="w-full pl-4 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all font-medium text-soft-dark resize-none"
            />
          </div>
          {errors.message && (
            <p className="text-[10px] text-red-600 font-medium px-1 italic">
              {errors.message}
            </p>
          )}
        </div>

        {/* Request Type Field - Radio Buttons */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold  tracking-wide text-soft-dark/50 px-1">
            Request Type
          </label>
          <div className="space-y-3">
            {[
              "Contact OrthoNu Consultant",
              "Customer Service",
              "General Inquiry",
            ].map((option) => (
              <div key={option} className="flex items-center gap-3">
                <input
                  id={`requestType-${option.replace(/\s+/g, "-").toLowerCase()}`}
                  type="radio"
                  name="requestType"
                  value={option}
                  checked={formData.requestType === option}
                  onChange={handleChange}
                  onBlur={() => handleBlur("requestType")}
                  aria-required="true"
                  aria-invalid={!!errors.requestType}
                  aria-describedby={
                    errors.requestType ? "requestType-error" : undefined
                  }
                  className="w-4 h-4 border border-zinc-200 rounded-full focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none cursor-pointer text-brand-blue"
                />
                <label
                  htmlFor={`requestType-${option.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-sm font-medium text-soft-dark/70 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {errors.requestType && (
            <p
              id="requestType-error"
              className="text-[10px] text-red-600 font-medium px-1 italic"
            >
              {errors.requestType}
            </p>
          )}
        </div>

        {/* Consent Checkbox Field */}
        <div className="flex flex-col gap-1.5 my-7">
          <div className="flex items-start gap-3">
            <input
              id="consentGiven"
              type="checkbox"
              name="consentGiven"
              checked={formData.consentGiven}
              onChange={handleChange}
              onBlur={() => handleBlur("consentGiven")}
              aria-required="true"
              aria-invalid={!!errors.consentGiven}
              aria-describedby={
                errors.consentGiven ? "consentGiven-error" : undefined
              }
              className="mt-1 w-4 h-4 border border-zinc-200 rounded focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none cursor-pointer"
            />
            <label
              htmlFor="consentGiven"
              className="text-sm font-medium text-soft-dark cursor-pointer"
            >
              I agree to be contacted with additional information and news.
            </label>
          </div>
          {errors.consentGiven && (
            <p className="text-[10px] text-red-600 font-medium px-1 italic">
              {errors.consentGiven}
            </p>
          )}
          {/* Consent Footer Text */}
          <p className="text-[10px] text-zinc-400 font-medium px-1 italic mt-2">
            I consent that OrthoNu® can communicate with me via the contact
            methods collected in this form. These communications may include
            news, product announcements and promotions.
          </p>
        </div>
      </div>

      {/* Submit Button - placeholder for Task 5 */}
      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-2.5 text-sm bg-brand-blue text-white rounded-full font-semibold hover:bg-atlantic-blue transition-all disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </button>
      </div>

      {/* Success Message - displays after successful submission */}
      {successMessage && (
        <div
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          role="status"
          aria-live="polite"
          aria-label="Form submission successful"
        >
          <p className="text-green-800 font-semibold">
            Thank you! Your message has been sent successfully. We'll be in
            touch soon.
          </p>
        </div>
      )}
    </form>
  );
}
