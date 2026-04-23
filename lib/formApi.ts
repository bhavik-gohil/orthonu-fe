/**
 * API utility functions for form submission
 * Handles communication with backend form endpoints
 */

import {
  ContactFormData,
  PartnerFormData,
  FormSubmissionResult,
  ContactFormSubmission,
  PartnerFormSubmission,
} from "@/components/forms/types";

const API_TIMEOUT = 30000; // 30 seconds in milliseconds

/**
 * Creates an AbortController with a timeout
 * @param timeoutMs - Timeout in milliseconds
 * @returns AbortController that will abort after timeout
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

/**
 * Submits contact form data to the backend
 * @param data - Contact form data to submit
 * @returns Promise resolving to API response
 * @throws Error if submission fails
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<FormSubmissionResult> {
  const controller = createTimeoutController(API_TIMEOUT);

  const payload: ContactFormSubmission = {
    ...data,
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/forms/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Form submission failed: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

/**
 * Submits partner form data to the backend
 * @param data - Partner form data to submit
 * @returns Promise resolving to API response
 * @throws Error if submission fails
 */
export async function submitPartnerForm(
  data: PartnerFormData
): Promise<FormSubmissionResult> {
  const controller = createTimeoutController(API_TIMEOUT);

  const payload: PartnerFormSubmission = {
    ...data,
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/forms/partnership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Form submission failed: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
