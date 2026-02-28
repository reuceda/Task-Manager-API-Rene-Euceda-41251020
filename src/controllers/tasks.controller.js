import taskService from '../services/tasks.service.js';

//obtener todas las tareas por id de usuario en el token bearer

const getAllTasks = async (req, res) => {
    const task = await taskService.getById(req.params.id);
    res.status(200).json(task||[]);
};

const getTaskById = async (req, res) => {
    const task = await taskService.getById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(task || []);
};

const create = async (req, res) => {

    const task = await taskService.create(req.body);
    res.status(201).json(task ||[]);
};

const updateTask = async (req, res) => {
    const updated = await taskService.update(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(updated);
};

const deleteTask = async (req, res) => {
    const deleted = await taskService.remove(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(204).send();
};

const taskController = {
    getAllTasks,
    getTaskById,
    create,
    updateTask,
    deleteTask
};

export default taskController;
