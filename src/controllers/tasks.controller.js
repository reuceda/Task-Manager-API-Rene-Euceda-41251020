const tasksService = require('../services/tasks.service');

//obtener todas las tareas por id de usuario en el token bearer

exports.getAllTasks = async (req, res) => {
    const task = await tasksService.getById(req.params.id);
    res.status(200).json(task||[]);
};

exports.getTaskById = async (req, res) => {
    const task = await tasksService.getById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(task || []);
};

exports.createTask = async (req, res) => {

    const task = await tasksService.create(req.body);
    res.status(201).json(task ||[]);
};

exports.updateTask = async (req, res) => {
    const updated = await tasksService.update(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(updated);
};

exports.deleteTask = async (req, res) => {
    const deleted = await tasksService.remove(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(204).send();
};