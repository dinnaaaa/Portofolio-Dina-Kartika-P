/**
 * Property-Based Tests: Form Validation Rejects Empty Fields
 *
 * Property 8: For any ContactFormData where one or more required fields is
 * empty or whitespace-only, validateContactForm returns isValid: false with
 * an error entry for each problematic field.
 *
 * Validates: Requirements 6.3
 *
 * Strategy:
 * - Test each required field (fullName, email, subject, message) in isolation
 *   with empty/whitespace-only values while keeping other fields valid.
 * - Test multiple empty fields simultaneously to confirm ALL errors are reported.
 * - Test whitespace-only values (spaces, tabs, newlines) are treated as empty.
 * - Test the all-fields-empty edge case.
 * - Test that a fully valid form returns isValid: true with no errors.
 */

import * as fc from 'fast-check';
import { validateContactForm } from '../../js/contact.js';

// ── Arbitraries ───────────────────────────────────────────────────────────────

/** Empty-or-whitespace string (empty string OR string of only whitespace chars). */
const emptyOrWhitespaceArb = fc.oneof(
  fc.constant(''),
  fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 })
);

/** Non-empty, non-whitespace string (trims to at least 1 char). */
const nonEmptyStringArb = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);

// Fixed valid values for fields that are NOT under test
const VALID_FULL_NAME = 'Dina Kartika';
const VALID_EMAIL = 'dina@example.com';
const VALID_SUBJECT = 'Test Subject';
const VALID_MESSAGE = 'Hello, this is a test message.';

// ── Suite 1: Single empty field ───────────────────────────────────────────────

describe('Property 8 — Form Validation Rejects Empty Fields: Single Field Empty', () => {
  it('empty/whitespace fullName produces isValid: false with fullName error', () => {
    // Feature: portfolio-profile, Property 8: empty fullName produces validation error
    fc.assert(
      fc.property(emptyOrWhitespaceArb, (emptyName) => {
        const result = validateContactForm({
          fullName: emptyName,
          email: VALID_EMAIL,
          subject: VALID_SUBJECT,
          message: VALID_MESSAGE,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('fullName');
      }),
      { numRuns: 100 }
    );
  });

  it('empty/whitespace email produces isValid: false with email error', () => {
    // Feature: portfolio-profile, Property 8: empty email produces validation error
    fc.assert(
      fc.property(emptyOrWhitespaceArb, (emptyEmail) => {
        const result = validateContactForm({
          fullName: VALID_FULL_NAME,
          email: emptyEmail,
          subject: VALID_SUBJECT,
          message: VALID_MESSAGE,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('email');
      }),
      { numRuns: 100 }
    );
  });

  it('empty/whitespace subject produces isValid: false with subject error', () => {
    // Feature: portfolio-profile, Property 8: empty subject produces validation error
    fc.assert(
      fc.property(emptyOrWhitespaceArb, (emptySubject) => {
        const result = validateContactForm({
          fullName: VALID_FULL_NAME,
          email: VALID_EMAIL,
          subject: emptySubject,
          message: VALID_MESSAGE,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('subject');
      }),
      { numRuns: 100 }
    );
  });

  it('empty/whitespace message produces isValid: false with message error', () => {
    // Feature: portfolio-profile, Property 8: empty message produces validation error
    fc.assert(
      fc.property(emptyOrWhitespaceArb, (emptyMessage) => {
        const result = validateContactForm({
          fullName: VALID_FULL_NAME,
          email: VALID_EMAIL,
          subject: VALID_SUBJECT,
          message: emptyMessage,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('message');
      }),
      { numRuns: 100 }
    );
  });
});

// ── Suite 2: Multiple empty fields simultaneously ─────────────────────────────

describe('Property 8 — Form Validation Rejects Empty Fields: Multiple Fields Empty', () => {
  it('both fullName and email empty produces errors for BOTH fields', () => {
    // Feature: portfolio-profile, Property 8: multiple empty fields all produce errors
    fc.assert(
      fc.property(emptyOrWhitespaceArb, emptyOrWhitespaceArb, (emptyName, emptyEmail) => {
        const result = validateContactForm({
          fullName: emptyName,
          email: emptyEmail,
          subject: VALID_SUBJECT,
          message: VALID_MESSAGE,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('fullName');
        expect(result.errors).toHaveProperty('email');
      }),
      { numRuns: 100 }
    );
  });

  it('both subject and message empty produces errors for BOTH fields', () => {
    // Feature: portfolio-profile, Property 8: multiple empty fields all produce errors
    fc.assert(
      fc.property(emptyOrWhitespaceArb, emptyOrWhitespaceArb, (emptySubject, emptyMessage) => {
        const result = validateContactForm({
          fullName: VALID_FULL_NAME,
          email: VALID_EMAIL,
          subject: emptySubject,
          message: emptyMessage,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveProperty('subject');
        expect(result.errors).toHaveProperty('message');
      }),
      { numRuns: 100 }
    );
  });

  it('three empty fields produces errors for all three fields', () => {
    // Feature: portfolio-profile, Property 8: three empty fields all produce errors
    fc.assert(
      fc.property(
        emptyOrWhitespaceArb,
        emptyOrWhitespaceArb,
        emptyOrWhitespaceArb,
        (emptyName, emptySubject, emptyMessage) => {
          const result = validateContactForm({
            fullName: emptyName,
            email: VALID_EMAIL,
            subject: emptySubject,
            message: emptyMessage,
          });

          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('fullName');
          expect(result.errors).toHaveProperty('subject');
          expect(result.errors).toHaveProperty('message');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Suite 3: Whitespace-only values treated as empty ─────────────────────────

describe('Property 8 — Form Validation Rejects Empty Fields: Whitespace-Only Values', () => {
  it('whitespace-only fullName (spaces, tabs, newlines) is treated as empty', () => {
    // Feature: portfolio-profile, Property 8: whitespace-only fields treated as empty
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 20 }),
        (whitespace) => {
          const result = validateContactForm({
            fullName: whitespace,
            email: VALID_EMAIL,
            subject: VALID_SUBJECT,
            message: VALID_MESSAGE,
          });

          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('fullName');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('whitespace-only subject (spaces, tabs, newlines) is treated as empty', () => {
    // Feature: portfolio-profile, Property 8: whitespace-only subject treated as empty
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 20 }),
        (whitespace) => {
          const result = validateContactForm({
            fullName: VALID_FULL_NAME,
            email: VALID_EMAIL,
            subject: whitespace,
            message: VALID_MESSAGE,
          });

          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('subject');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('whitespace-only message (spaces, tabs, newlines) is treated as empty', () => {
    // Feature: portfolio-profile, Property 8: whitespace-only message treated as empty
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 20 }),
        (whitespace) => {
          const result = validateContactForm({
            fullName: VALID_FULL_NAME,
            email: VALID_EMAIL,
            subject: VALID_SUBJECT,
            message: whitespace,
          });

          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('message');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Suite 4: All fields empty ─────────────────────────────────────────────────

describe('Property 8 — Form Validation Rejects Empty Fields: All Fields Empty', () => {
  it('all four fields empty produces isValid: false with errors for all four fields', () => {
    // Feature: portfolio-profile, Property 8: all fields empty yields errors for all fields
    fc.assert(
      fc.property(
        emptyOrWhitespaceArb,
        emptyOrWhitespaceArb,
        emptyOrWhitespaceArb,
        emptyOrWhitespaceArb,
        (emptyName, emptyEmail, emptySubject, emptyMessage) => {
          const result = validateContactForm({
            fullName: emptyName,
            email: emptyEmail,
            subject: emptySubject,
            message: emptyMessage,
          });

          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('fullName');
          expect(result.errors).toHaveProperty('email');
          expect(result.errors).toHaveProperty('subject');
          expect(result.errors).toHaveProperty('message');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('completely empty object {} produces errors for all four fields', () => {
    // Feature: portfolio-profile, Property 8: empty object yields all four field errors
    const result = validateContactForm({});

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('fullName');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('subject');
    expect(result.errors).toHaveProperty('message');
  });
});

// ── Suite 5: Fully valid form ─────────────────────────────────────────────────

describe('Property 8 — Form Validation Rejects Empty Fields: Valid Form Returns True', () => {
  it('form with all non-empty, non-whitespace fields and valid email returns isValid: true', () => {
    // Feature: portfolio-profile, Property 8: fully valid form returns isValid true with no errors
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        nonEmptyStringArb,
        (validName, validSubject, validMessage) => {
          const result = validateContactForm({
            fullName: validName,
            email: VALID_EMAIL,
            subject: validSubject,
            message: validMessage,
          });

          expect(result.isValid).toBe(true);
          expect(Object.keys(result.errors)).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 9: Email Validation Correctness ──────────────────────────────────

/**
 * Property 9: Email Validation Correctness
 *
 * Validates: Requirements 6.4
 *
 * Strategy:
 * - Strings without '@' must always return false from isValidEmail.
 * - Strings generated by fc.emailAddress() (valid RFC-compliant emails)
 *   must always return true from isValidEmail.
 */

import { isValidEmail } from '../../js/contact.js';

describe('Property 9 — Email Validation Correctness', () => {
  it('menolak string yang tidak mengandung @', () => {
    // Feature: portfolio-profile, Property 9: isValidEmail returns false without @
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('@')),
        (email) => isValidEmail(email) === false
      ),
      { numRuns: 100 }
    );
  });

  it('menerima email dengan format valid', () => {
    // Feature: portfolio-profile, Property 9: isValidEmail returns true for valid format
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => isValidEmail(email) === true
      ),
      { numRuns: 100 }
    );
  });
});
