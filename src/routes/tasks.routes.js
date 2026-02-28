import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import validateRequest  from '../middleware/validate.middleware.js';
import taskController from '../controllers/tasks.controller.js';

const router = Router();

router.get('/', taskController.getAllTasks);

router.get('/:id',
    validateRequest([param('id').isInt().withMessage('ID must be an integer')]),
    verifyToken,
    taskController.getTaskById
);

router.post('/',
    validateRequest([
        body('title').isString().withMessage('El titulo es requerido'),
        body('description').isString().withMessage('La descripción es requerida'),
        body('status').isString().withMessage('Status inválido'),
        body('userId').isUUID().withMessage('Usuario inválido'),
    ]),
    verifyToken,
    taskController.create
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
    taskController.updateTask
);

router.delete('/:id',
    validateRequest([param('id').isInt().withMessage('ID must be an integer')]),
    verifyToken,
    taskController.deleteTask
);

export default router;
