import { z } from 'zod';

export const uploadAssetSchema = z.object({
    type: z.enum(['logo', 'userImage', 'colorTheme']),
});
