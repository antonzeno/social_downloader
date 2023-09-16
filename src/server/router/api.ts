import express from 'express';
import { downloadFromYoutube, downloadFromUrl } from '../controllers/download';


export default (router: express.Router) => {
    router.post('/api/youtube', downloadFromYoutube);
    router.post('/api/download', downloadFromUrl);
}