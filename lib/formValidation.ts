/**
 * Form validation utilities for Contact & Partnership Forms
 * Provides pure, testable validation functions for all form fields
 */

/**
 * Validates email format using RFC 5322 simplified pattern
 * @param email - Email string to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number format
 * Requires 10 or more digits after stripping non-digit characters
 * @param phone - Phone string to validate
 * @returns true if phone is valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

/**
 * Validates message/needs field length
 * Requires minimum 10 characters (after trimming whitespace)
 * @param message - Message string to validate
 * @returns true if message meets minimum length, false otherwise
 */
export function validateMessageLength(message: string): boolean {
  return message.trim().length >= 10;
}

/**
 * Validates that a required field is not empty
 * Checks for non-empty string after trimming whitespace
 * @param value - Field value to validate
 * @returns true if field is not empty, false otherwise
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates that a number is a positive integer
 * @param value - Number to validate
 * @returns true if value is a positive integer, false otherwise
 */
export function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validates that a checkbox is checked (true)
 * @param value - Boolean value to validate
 * @returns true if value is true, false otherwise
 */
export function validateCheckbox(value: boolean): boolean {
  return value === true;
}

/**
 * Validates that a select field has a valid option selected
 * @param value - Selected value to validate
 * @param validOptions - Array of valid option values
 * @returns true if value is in validOptions, false otherwise
 */
export function validateSelect(value: string, validOptions: string[]): boolean {
  return validOptions.includes(value);
}
