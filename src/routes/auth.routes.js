import { Router } from 'express';
import {
    register,
    login,
    refreshToken,
    logout,
    logoutAll,
    getProfile,
} from '../controllers/auth.controller.js';

import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

//rutas protegidas
router.post('/logout-all', verifyToken, logoutAll);
router.get('/profile', verifyToken, getProfile);

//ruta solo para admin
router.get('/admin-only', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenido al panel de administración'});
});

export default router;
