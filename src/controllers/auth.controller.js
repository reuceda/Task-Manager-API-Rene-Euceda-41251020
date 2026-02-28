import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { jwtConfig } from '../config/jwt.config.js';
import { User, RefreshToken } from '../models/index.js';
import e from 'express';
import { token } from 'morgan';

//helpers

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, jwtConfig.secret, { 
        expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: expiresInRefresh,
    });

    return { accessToken, refreshToken };
};

const getRefreshTokenExpiry = () => {
    const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return expiresAt;
};

//controladores

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente.',
            user,
        });
    } catch (error) {
        //Error de validación de Sequelize
        if (error.name === 'SequelizeValidationError' || 
            error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    message: 'Error de validación.',
                    errors: error.errors.map(e => ({field: e.path, message: e.message })),
                });
        }
        res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        //Buscar usuario incluyendo password (por defecto toJSON lo omite)
        const user = await User.findOne({
            where: { email, isActive: true },
            attributes: { include: ['password'] },
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        //actualizar laslogin

        await user.update({ lastLogin: new Date() });

        //generar tokens
        const payload = { id: user.id, email: user.email, username: user.username, role: user.role };
        const { accessToken, refreshToken } = generateTokens(payload);

        //guardar refresh token en la base de datos
        await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: getRefreshTokenExpiry(),
            ipAdress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        res.json({
            message: 'Login exitoso.',
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token es requerido.' });
        }

        //buscar token en la base de datos
        const tokenRecord = await RefreshToken.findOne({
            where: { token: refreshToken }});

            if (!tokenRecord || !RefreshToken.isValid(tokenRecord)) {
                return res.status(403).json({ message: 'Refresh token inválido o revocado.' });
            }

            //verificar jwt
            const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

            //revocar token usado (rotacion)
            await tokenRecord.update({ isRevoked: true });

            //generar nuevos tokens
            const payload = { id: decoded.id, email: decoded.email, username: decoded.username, role: decoded.role };
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);

            //guardar nuevo refresh token
            await RefreshToken.create({
                token: newRefreshToken,
                userId: decoded.id,
                expiresAt: getRefreshTokenExpiry(),
                ipAdress: req.ip,
                userAgent: req.headers['user-agent'],
            });

            res.json({
                accessToken,
                refreshToken: newRefreshToken,
            });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            await RefreshToken.update({ revoked: true }, 
                { where: { token: req.body.refreshToken } });
                return res.status(403).json({ message: 'Refresh token expirado, inicia sesión nuevamente.' });
        }
        res.status(403).json({ message: 'Refresh token inválido.' });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            await RefreshToken.update({ isRevoked: true },
                { where: { token: refreshToken } });
        }
        res.json({ message: 'Sesión cerrada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión.', error: error.message });
    }
};

export const logoutAll = async (req, res) => {
    try {
        //revocar todos los tokens del usuario (cerrar todas las sesiones)
        await RefreshToken.update({ isRevoked: true },
            { where: { userId: req.user.id, isRevoked: false } });

        res.json({ message: 'Todas las sesiones cerradas correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesiones.', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil.', error: error.message });
    }
};

//tarea de limpieza: eliminar tokens expirados (llamar con cron)
export const cleanExpiredTokens = async () => {
    const deleted = await RefreshToken.destroy({
        where: {
            expiresAt: { [Op.lt]: new Date() }},
    });
    console.log(`🧹 ${deleted} refresh tokens expirados eliminados.`);
};