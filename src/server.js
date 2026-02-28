import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import { cleanExpiredTokens } from './controllers/auth.controller.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

//Sincronizar modelos y luego iniciar el servidor
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');

        //alter:true actualiza tablas sin borrar datos
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados.');

        //limpiar tokens expirados cada 24 horas
        setInterval(cleanExpiredTokens, 24 * 60 * 60 * 1000);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Error al iniciar el servidor: ${process.env.DB_USER}`, error);
        process.exit(1);
    }
};

start();