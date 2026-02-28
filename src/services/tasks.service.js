const Tasks = require('../models/task.model');

const getAll = async (userid) => await Tasks.getAllTasks(userid);

const getById = async (id) => await Tasks.getTaskById(id);

const findOne = async (data) => await Tasks.getTaskById({ where: data });

const create = async (data) => await Tasks.createTask(data);

const update = async (id, data) => {
    const Task = await Tasks.getTaskById(id);
    if (!Task) return null;
    return await Task.updateTask(data);
};

const remove = async (id) => {
    const Task = await Tasks.getTaskById(id);
    if (!Task) return null;
    await Task.destroy();
    return Task;
};

module.exports = {
    getAll,
    getById,
    findOne,
    create,
    update,
    remove,
};