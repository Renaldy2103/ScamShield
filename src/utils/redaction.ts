/**
 * Redacts sensitive personal and authentication data from logs and storage previews.
 */

export function redactSensitiveData(input: string): string {
  if (!input) return '';

  let sanitized = input;

  // Redact email addresses
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[REDACTED_EMAIL]'
  );

  // Redact phone numbers (Indonesian & international format)
  sanitized = sanitized.replace(
    /(?:\+62|62|08)[0-9]{8,12}\b/g,
    '[REDACTED_PHONE]'
  );

  // Redact card numbers (13-19 digits, spaced or dashes)
  sanitized = sanitized.replace(
    /\b(?:\d{4}[ -]?){3}\d{1,4}\b/g,
    '[REDACTED_CARD]'
  );

  // Redact tokens/passwords in query parameters (e.g. ?token=xyz or &key=abc)
  sanitized = sanitized.replace(
    /([?&](?:token|password|passwd|key|auth|api_key|secret|code|otp|session)=)[^&\s]+/gi,
    '$1[REDACTED]'
  );

  return sanitized;
}

export function createInputPreview(input: string, maxLength = 80): string {
  const redacted = redactSensitiveData(input.trim());
  if (redacted.length <= maxLength) {
    return redacted;
  }
  return redacted.substring(0, maxLength) + '...';
}
