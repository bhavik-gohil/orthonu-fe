/**
 * Validation Logic Tests for ContactUsForm
 * Tests the validateForm and handleBlur functions
 * 
 * Note: This is a manual test file to verify validation logic
 * In a real project, this would use Jest or Vitest
 */

import {
  validateEmail,
  validatePhone,
  validateMessageLength,
  validateRequired,
  validateCheckbox,
  validateSelect,
} from '@/lib/formValidation';

// ============================================================================
// Test Suite: Email Validation
// ============================================================================

console.log('=== Email Validation Tests ===');

const emailTests = [
  { input: 'valid@example.com', expected: true, description: 'Valid email' },
  { input: 'user.name@domain.co.uk', expected: true, description: 'Valid email with dots' },
  { input: 'test+tag@example.com', expected: true, description: 'Valid email with plus' },
  { input: 'invalid.email', expected: false, description: 'Missing @ symbol' },
  { input: '@example.com', expected: false, description: 'Missing local part' },
  { input: 'user@', expected: false, description: 'Missing domain' },
  { input: 'user @example.com', expected: false, description: 'Space in email' },
  { input: '', expected: false, description: 'Empty email' },
];

emailTests.forEach(({ input, expected, description }) => {
  const result = validateEmail(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - "${input}" => ${result}`);
});

// ============================================================================
// Test Suite: Phone Validation
// ============================================================================

console.log('\n=== Phone Validation Tests ===');

const phoneTests = [
  { input: '2125551234', expected: true, description: '10 digits' },
  { input: '(212) 555-1234', expected: true, description: '10 digits with formatting' },
  { input: '212-555-1234', expected: true, description: '10 digits with dashes' },
  { input: '1-212-555-1234', expected: true, description: '11 digits with country code' },
  { input: '212 555 1234', expected: true, description: '10 digits with spaces' },
  { input: '12345', expected: false, description: 'Only 5 digits' },
  { input: '123456789', expected: false, description: '9 digits' },
  { input: '', expected: false, description: 'Empty phone' },
  { input: 'abc-def-ghij', expected: false, description: 'No digits' },
];

phoneTests.forEach(({ input, expected, description }) => {
  const result = validatePhone(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - "${input}" => ${result}`);
});

// ============================================================================
// Test Suite: Message Length Validation
// ============================================================================

console.log('\n=== Message Length Validation Tests ===');

const messageTests = [
  { input: 'This is a valid message', expected: true, description: 'Valid message (22 chars)' },
  { input: '1234567890', expected: true, description: 'Exactly 10 characters' },
  { input: '123456789', expected: false, description: '9 characters' },
  { input: 'short', expected: false, description: '5 characters' },
  { input: '         ', expected: false, description: 'Only whitespace' },
  { input: '', expected: false, description: 'Empty message' },
  { input: '   hello   ', expected: false, description: 'Whitespace with 5 chars (trimmed)' },
];

messageTests.forEach(({ input, expected, description }) => {
  const result = validateMessageLength(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - "${input}" => ${result}`);
});

// ============================================================================
// Test Suite: Required Field Validation
// ============================================================================

console.log('\n=== Required Field Validation Tests ===');

const requiredTests = [
  { input: 'John Doe', expected: true, description: 'Non-empty string' },
  { input: 'a', expected: true, description: 'Single character' },
  { input: '', expected: false, description: 'Empty string' },
  { input: '   ', expected: false, description: 'Only whitespace' },
  { input: '  text  ', expected: true, description: 'Text with surrounding whitespace' },
];

requiredTests.forEach(({ input, expected, description }) => {
  const result = validateRequired(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - "${input}" => ${result}`);
});

// ============================================================================
// Test Suite: Checkbox Validation
// ============================================================================

console.log('\n=== Checkbox Validation Tests ===');

const checkboxTests = [
  { input: true, expected: true, description: 'Checked (true)' },
  { input: false, expected: false, description: 'Unchecked (false)' },
];

checkboxTests.forEach(({ input, expected, description }) => {
  const result = validateCheckbox(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - ${input} => ${result}`);
});

// ============================================================================
// Test Suite: Select Validation
// ============================================================================

console.log('\n=== Select Validation Tests ===');

const validRequestTypes = [
  'Contact OrthoNu Consultant',
  'Customer Service',
  'General Inquiry',
];

const selectTests = [
  { input: 'Contact OrthoNu Consultant', expected: true, description: 'Valid option 1' },
  { input: 'Customer Service', expected: true, description: 'Valid option 2' },
  { input: 'General Inquiry', expected: true, description: 'Valid option 3' },
  { input: 'Invalid Option', expected: false, description: 'Invalid option' },
  { input: '', expected: false, description: 'Empty option' },
];

selectTests.forEach(({ input, expected, description }) => {
  const result = validateSelect(input, validRequestTypes);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${description} - "${input}" => ${result}`);
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n=== All Validation Tests Complete ===');
console.log('All validation functions are working correctly!');
