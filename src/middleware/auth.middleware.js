import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is requerido.' });
    }

    try {
        req.user = jwt.verify(token, jwtConfig.secret);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expirado.', code: 'TOKEN_EXPIRED' });
        }
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

//middleware de roles

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado.' });
        }
        next();
    };
};

