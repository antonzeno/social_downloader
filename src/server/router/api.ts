import express from 'express';
import { downloadFromYoutube } from '../controllers/download';


export default (router: express.Router) => {
    router.post('/api/youtube', downloadFromYoutube);
}