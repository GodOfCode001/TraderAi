import validator from 'validator'

export const sanitizeInput = (input) => {
    let sanitizedInput = validator.trim(input);

    sanitizedInput = validator.escape(sanitizedInput);

    return sanitizedInput;
}

export const sanitizeEmailInput = (input) => {
    if (typeof input !== "string") {
        return '';
    }

    if (!validator.isEmail(input)) {
        return '';
    }

    let sanitizedEmailInput = validator.escape(input);
    return sanitizedEmailInput;
}