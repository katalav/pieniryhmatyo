const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
exports.getTasks = async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
};
 
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = await prisma.task.create({
        data: { title, description }
    });
    res.json(task);
};
 
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { title, description, status }
    });
    res.json(task);
};
 
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Task deleted' });
};