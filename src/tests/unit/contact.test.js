/**
 * contact.test.js — Unit tests for isValidEmail and validateContactForm
 */

import { isValidEmail, validateContactForm } from '../../js/contact.js';

describe('isValidEmail', () => {
  it('returns true for a valid email address', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('returns false when there is no @ sign', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  it('returns false when the local part is empty (@nodomain)', () => {
    expect(isValidEmail('@nodomain')).toBe(false);
  });

  it('returns false for "missing-at-sign" (no @)', () => {
    expect(isValidEmail('missing-at-sign')).toBe(false);
  });

  it('returns false when there are multiple @ signs', () => {
    expect(isValidEmail('two@@signs.com')).toBe(false);
  });

  it('returns false when the domain has no dot', () => {
    expect(isValidEmail('nodot@domain')).toBe(false);
  });

  it('returns true for a complex valid email with subdomains and tags', () => {
    expect(isValidEmail('user.name+tag@sub.domain.co.uk')).toBe(true);
  });
});

describe('validateContactForm', () => {
  it('returns isValid true with no errors when all fields are properly filled', () => {
    const result = validateContactForm({
      fullName: 'Dina Kartika',
      email: 'dina@example.com',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns isValid false with fullName error when fullName is empty', () => {
    const result = validateContactForm({
      fullName: '',
      email: 'dina@example.com',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.fullName).toBe('Nama lengkap wajib diisi.');
  });

  it('returns isValid false with email error when email is empty', () => {
    const result = validateContactForm({
      fullName: 'Dina Kartika',
      email: '',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Alamat email wajib diisi.');
  });

  it('returns isValid false with subject error when subject is empty', () => {
    const result = validateContactForm({
      fullName: 'Dina Kartika',
      email: 'dina@example.com',
      subject: '',
      message: 'Test message',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.subject).toBe('Subjek pesan wajib diisi.');
  });

  it('returns isValid false with message error when message is empty', () => {
    const result = validateContactForm({
      fullName: 'Dina Kartika',
      email: 'dina@example.com',
      subject: 'Hello',
      message: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.message).toBe('Pesan tidak boleh kosong.');
  });

  it('returns isValid false with email format error when email format is invalid', () => {
    const result = validateContactForm({
      fullName: 'Dina Kartika',
      email: 'notvalid',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Format email tidak valid. Contoh: nama@domain.com');
  });

  it('returns isValid false with all four field errors when all fields are empty', () => {
    const result = validateContactForm({
      fullName: '',
      email: '',
      subject: '',
      message: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.fullName).toBe('Nama lengkap wajib diisi.');
    expect(result.errors.email).toBe('Alamat email wajib diisi.');
    expect(result.errors.subject).toBe('Subjek pesan wajib diisi.');
    expect(result.errors.message).toBe('Pesan tidak boleh kosong.');
  });

  it('treats whitespace-only fullName as empty', () => {
    const result = validateContactForm({
      fullName: '   ',
      email: 'dina@example.com',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.fullName).toBe('Nama lengkap wajib diisi.');
  });
});
