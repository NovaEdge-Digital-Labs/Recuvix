"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAssetSchema = void 0;
const zod_1 = require("zod");
exports.uploadAssetSchema = zod_1.z.object({
    type: zod_1.z.enum(['logo', 'userImage', 'colorTheme']),
});
