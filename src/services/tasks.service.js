import Tasks from '../models/task.model.js';

const getAll = async (userid) => await Tasks.getAllTasks(userid);

const getById = async (id) => await Tasks.getTaskById(id);

const findOne = async (data) => await Tasks.getTaskById({ where: data });

const create = async (data) => await Tasks.create(data);

const update = async (id, data) => {
    const task = await Tasks.getTaskById(id);
    if (!task) return null;
    return await task.updateTask(data);
};

const remove = async (id) => {
    const task = await Tasks.getTaskById(id);
    if (!task) return null;
    await task.destroy();
    return task;
};

const taskService = {
    getAll,
    getById,
    findOne,
    create,
    update,
    remove,
};

export default taskService;
