import express from 'express';
import api from './api';
import authentication from './authentication';

const router = express.Router();

export default (): express.Router => {
    api(router);
    authentication(router);

    return router;
}