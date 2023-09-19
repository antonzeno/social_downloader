import express from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }

        (req as any).user = decoded;
        next();
    });
};
