// app.js (or index.js)
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy' });
});

// Analyze endpoint
app.post('/contract-analyze', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'No code provided' });
        }

        // Create temporary file
        const tempFile = path.join(__dirname, `temp-${Date.now()}.sol`);
        await fs.writeFile(tempFile, code);

        try {
            const { stdout, stderr } = await execAsync(`slither "${tempFile}" --print human-summary`);
            await fs.unlink(tempFile); // Clean up

            return res.json({
                status: 'success',
                result: stdout,
                warnings: stderr
            });
        } catch (execError) {
            await fs.unlink(tempFile); // Clean up
            return res.status(500).json({
                status: 'error',
                error: execError.message
            });
        }
    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Slither service running on port ${PORT}`);
});