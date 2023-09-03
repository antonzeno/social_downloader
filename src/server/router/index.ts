import express from 'express';
import api from './api';

const router = express.Router();

export default (): express.Router => {
    api(router);

    return router;
}