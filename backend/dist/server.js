"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables before any other local imports
dotenv_1.default.config();
const upload_1 = __importDefault(require("./routes/upload"));
const images_1 = __importDefault(require("./routes/images"));
const seo_1 = __importDefault(require("./routes/seo"));
const thumbnail_1 = __importDefault(require("./routes/thumbnail"));
const export_1 = __importDefault(require("./routes/export"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
// Use CORS middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
// Mount routers
app.use('/api/upload', upload_1.default);
app.use('/api/images', images_1.default);
app.use('/api/seo', seo_1.default);
app.use('/api/thumbnail', thumbnail_1.default);
app.use('/api/export', export_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
