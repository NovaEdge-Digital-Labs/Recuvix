"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_IMAGE_TYPES = exports.MAX_FILE_SIZE = void 0;
exports.validateImageFile = validateImageFile;
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
function validateImageFile(file) {
    if (!exports.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }
    if (file.size > exports.MAX_FILE_SIZE) {
        return { isValid: false, error: 'File size exceeds the 5MB limit.' };
    }
    return { isValid: true };
}
