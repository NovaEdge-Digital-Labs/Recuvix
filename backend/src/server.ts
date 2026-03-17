import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables before any other local imports
dotenv.config();

import uploadRouter from './routes/upload';
import imagesRouter from './routes/images';
import seoRouter from './routes/seo';
import thumbnailRouter from './routes/thumbnail';
import exportRouter from './routes/export';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// Use CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Mount routers
app.use('/api/upload', uploadRouter);
app.use('/api/images', imagesRouter);
app.use('/api/seo', seoRouter);
app.use('/api/thumbnail', thumbnailRouter);
app.use('/api/export', exportRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
