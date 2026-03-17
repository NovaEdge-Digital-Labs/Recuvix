export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: { mimetype: string; size: number }): { isValid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: 'File size exceeds the 5MB limit.' };
    }

    return { isValid: true };
}
