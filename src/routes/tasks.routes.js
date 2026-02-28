import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import {validateRequest }  from '../middlewares/validate.middleware';
import {tasksController} from '../controllers/tasks.controller';

const router = Router();

router.get('/', tasksController.getAllTasks);

router.get('/:id',
    validateRequest([param('id').isInt().withMessage('ID must be an integer')]),
    verifyToken,
    tasksController.getTaskById
);

router.post('/',
    validateRequest([
        body('title').isString().withMessage('El titulo es requerido'),
        body('description').isString().withMessage('La descripción es requerida'),
        body('status').isString().withMessage('Status inválido'),
        body('userId').isUUID().withMessage('Usuario inválido'),
    ]),
    verifyToken,
    tasksController.createTask
);

router.put('/:id',
    validateRequest([
        param('id').isInt().withMessage('ID must be an integer'),
        body('title').isString().withMessage('El titulo es requerido'),
        body('description').isString().withMessage('La descripción es requerida'),
        body('status').isString().withMessage('Status inválido'),
        body('userId').isUUID().withMessage('Usuario inválido'),
    ]),
    verifyToken,
    tasksController.updateTask
);

router.delete('/:id',
    validateRequest([param('id').isInt().withMessage('ID must be an integer')]),
    verifyToken,
    tasksController.deleteTask
);

export default router;
