"use client";

import React, { useState, ChangeEvent, FormEvent, JSX } from "react";
import { PartnerFormData, PartnerWithUsFormProps, FormErrors } from "./types";
import { apiCall } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import {
  validateEmail,
  validateMessageLength,
  validateRequired,
  validatePositiveInteger,
} from "@/lib/formValidation";

/**
 * PartnerWithUsForm Component
 *
 * A standalone, reusable form component for collecting enterprise partnership inquiries.
 * Manages form state, validation, and submission with comprehensive error handling.
 *
 * @component
 * @param {PartnerWithUsFormProps} props - Component props
 * @param {Function} [props.onSubmitSuccess] - Callback fired when form submission succeeds
 * @param {Function} [props.onSubmitError] - Callback fired when form submission fails
 * @param {string} [props.className] - Additional CSS classes for the form container
 * @param {string} [props.submitButtonText] - Custom text for the submit button (default: "Request Partnership Info")
 * @param {number} [props.successMessageDuration] - Duration in milliseconds to display success message (default: 3000)
 * @returns {JSX.Element} The rendered form component
 *
 * @example
 * ```tsx
 * <PartnerWithUsForm
 *   onSubmitSuccess={(data) => console.log('Form submitted:', data)}
 *   onSubmitError={(error) => console.error('Form error:', error)}
 *   submitButtonText="Request Partnership Info"
 * />
 * ```
 */
export default function PartnerWithUsForm({
  onSubmitSuccess,
  onSubmitError,
  className = "",
  submitButtonText = "Request Partnership Info",
  successMessageDuration = 3000,
}: PartnerWithUsFormProps): JSX.Element {
  // ============================================================================
  // State Management
  // ============================================================================

  /**
   * Form data state - stores all 5 form field values
   * Initialized with empty strings and 0 for number field
   */
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    organization: "",
    workEmail: "",
    numberOfLocations: 0,
    needs: "",
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
   * Validates all 5 form fields
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

    // Validate Organization (required, non-empty)
    if (!validateRequired(formData.organization)) {
      newErrors.organization = "Organization is required";
    }

    // Validate Work Email (required, valid email format)
    if (!validateRequired(formData.workEmail)) {
      newErrors.workEmail = "Work Email is required";
    } else if (!validateEmail(formData.workEmail)) {
      newErrors.workEmail = "Please enter a valid work email address";
    }

    // Validate Number of Locations (required, positive integer)
    if (
      formData.numberOfLocations === 0 ||
      formData.numberOfLocations === null
    ) {
      newErrors.numberOfLocations = "Number of Locations is required";
    } else if (!validatePositiveInteger(formData.numberOfLocations)) {
      newErrors.numberOfLocations = "Please enter a valid number of locations";
    }

    // Validate Needs (required, minimum 10 characters)
    if (!validateRequired(formData.needs)) {
      newErrors.needs = "Please tell us about your needs";
    } else if (!validateMessageLength(formData.needs)) {
      newErrors.needs =
        "Please tell us more about your needs (minimum 10 characters)";
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
   * @param {ChangeEvent} e - Change event from input or textarea element
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;

    // Handle number input separately (convert to number)
    if (type === "number") {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      // Handle text inputs and textareas
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user interacts with it
    // Also clear submit error to allow retry
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      submit: undefined,
    }));
  };

  /**
   * Handles form field changes for Input component
   * Updates form data state and clears field error on change
   *
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleInputChange = (name: string, value: string): void => {
    // Handle number field separately
    if (name === "numberOfLocations") {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
      organization: "",
      workEmail: "",
      numberOfLocations: 0,
      needs: "",
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
      const response = await apiCall("POST", "/api/forms/partnership", payload);

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
  const handleBlur = (fieldName: keyof PartnerFormData): void => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!validateRequired(formData.name)) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;

      case "organization":
        if (!validateRequired(formData.organization)) {
          newErrors.organization = "Organization is required";
        } else {
          delete newErrors.organization;
        }
        break;

      case "workEmail":
        if (!validateRequired(formData.workEmail)) {
          newErrors.workEmail = "Work Email is required";
        } else if (!validateEmail(formData.workEmail)) {
          newErrors.workEmail = "Please enter a valid work email address";
        } else {
          delete newErrors.workEmail;
        }
        break;

      case "numberOfLocations":
        if (
          formData.numberOfLocations === 0 ||
          formData.numberOfLocations === null
        ) {
          newErrors.numberOfLocations = "Number of Locations is required";
        } else if (!validatePositiveInteger(formData.numberOfLocations)) {
          newErrors.numberOfLocations =
            "Please enter a valid number of locations";
        } else {
          delete newErrors.numberOfLocations;
        }
        break;

      case "needs":
        if (!validateRequired(formData.needs)) {
          newErrors.needs = "Please tell us about your needs";
        } else if (!validateMessageLength(formData.needs)) {
          newErrors.needs =
            "Please tell us more about your needs (minimum 10 characters)";
        } else {
          delete newErrors.needs;
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
    <form onSubmit={handleSubmit} className={`partner-form ${className}`} >
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
      <div id="partner-with-us" className="space-y-2 mb-8 scroll-mt-24">
        <h1 className="text-2xl md:text-4xl font-bold text-soft-dark">
          Scale OrthoNu Across Your Network
        </h1>
        <p className="md:text-sm text-soft-dark/70">
          DSOs and distributors — let's explore volume pricing, custom
          implementation, and dedicated support for your organization.
        </p>
      </div>

      {/* Form Fields Section */}
      <div className="space-y-3 md:space-y-4 space-x-4 grid md:grid-cols-2">
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

        {/* Organization Field */}
        <Input
          label="Organization"
          value={formData.organization}
          onChange={(value) => handleInputChange("organization", value)}
          required={true}
          name="organization"
          type="text"
          note={errors.organization}
          className={errors.organization ? "text-red-600" : ""}
        />

        {/* Work Email Field */}
        <Input
          label="Work Email"
          value={formData.workEmail}
          onChange={(value) => handleInputChange("workEmail", value)}
          required={true}
          name="workEmail"
          type="email"
          note={errors.workEmail}
          className={errors.workEmail ? "text-red-600" : ""}
        />

        {/* Number of Locations Field */}
        <Input
          label="Number of Locations"
          value={
            formData.numberOfLocations === 0
              ? ""
              : formData.numberOfLocations.toString()
          }
          onChange={(value) => handleInputChange("numberOfLocations", value)}
          required={true}
          name="numberOfLocations"
          type="number"
          note={errors.numberOfLocations}
          className={errors.numberOfLocations ? "text-red-600" : ""}
        />
      </div>

      {/* Tell Us About Your Needs Field */}
      <div className="flex flex-col gap-1.5 mt-3 md:mt-0">
        <label className="text-xs font-bold tracking-wide text-soft-dark/50 px-1">
          Tell Us About Your Needs
        </label>
        <div className="relative group">
          <textarea
            id="needs"
            name="needs"
            value={formData.needs}
            onChange={handleChange}
            onBlur={() => handleBlur("needs")}
            aria-required="true"
            aria-invalid={!!errors.needs}
            aria-describedby={errors.needs ? "needs-error" : undefined}
            rows={5}
            className="w-full pl-4 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all font-medium text-soft-dark resize-none"
          />
        </div>
        {errors.needs && (
          <p className="text-[10px] text-red-600 font-medium px-1 italic">
            {errors.needs}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 px-10 py-2.5 text-sm bg-brand-blue text-white rounded-full font-semibold hover:bg-atlantic-blue transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            Thank you! Your partnership inquiry has been sent successfully.
            We'll be in touch soon to discuss opportunities.
          </p>
        </div>
      )}
    </form>
  );
}
