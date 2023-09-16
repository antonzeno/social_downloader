import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';

import router from './router';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use bodyParser to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS to allow cross-origin requests
app.use(
    cors({
        credentials: true,
        exposedHeaders: ['Content-Disposition']
    })
);
// Use compression to compress responses
app.use(compression());
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/videos', express.static(path.join(__dirname, 'downloads')));
app.use('/', router());