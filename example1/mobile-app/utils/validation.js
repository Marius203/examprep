export const validateDate = (dateString) => {
    // Check format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
    }

    // Parse date parts
    const [year, month, day] = dateString.split('-').map(Number);

    // Check if date is actually valid
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return { valid: false, error: 'Invalid date (e.g., Feb 31 doesn\'t exist)' };
    }

    // Check reasonable year range
    if (year < 2000 || year > 2100) {
        return { valid: false, error: 'Year must be between 2000 and 2100' };
    }

    return { valid: true };
};

export const validateAmount = (amountString) => {
    const amount = parseFloat(amountString);

    if (isNaN(amount)) {
        return { valid: false, error: 'Amount must be a number' };
    }

    if (amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (amount > 999999) {
        return { valid: false, error: 'Amount is too large' };
    }

    // Check decimal places (max 2)
    const decimalPart = amountString.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
        return { valid: false, error: 'Amount can have at most 2 decimal places' };
    }

    return { valid: true, value: amount };
};

export const sanitizeText = (text) => {
    // Remove potentially problematic characters
    return text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
};

export const validateTextField = (text, fieldName, minLength = 1, maxLength = 200) => {
    const trimmed = text.trim();

    if (trimmed.length < minLength) {
        return { valid: false, error: `${fieldName} is required` };
    }

    if (trimmed.length > maxLength) {
        return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
    }

    return { valid: true, value: sanitizeText(trimmed) };
};
