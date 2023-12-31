import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoose from 'mongoose';

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
        origin: 'http://localhost:3000',
        credentials: true,
        exposedHeaders: ['Content-Disposition']
    })
);
// Use compression to compress responses
app.use(compression());
app.use(cookieParser());

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL as string);
mongoose.connection.on('error', (error: Error) => console.log(error));


app.use('/videos', express.static(path.join(__dirname, 'downloads')));
app.use('/', router());