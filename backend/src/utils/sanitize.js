function normalizeSpaces(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ');
}

function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  const withoutTags = stripTags(value).replace(/[\u0000-\u001F\u007F]/g, ' ');
  const normalized = normalizeSpaces(withoutTags);

  if (!normalized) {
    return '';
  }

  return normalized.slice(0, maxLength);
}

module.exports = {
  sanitizeText
};
