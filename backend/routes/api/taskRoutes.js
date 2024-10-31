const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');




// Create a new task
router.post('/tasks', async (req, res) => {
    const { title, description, dueDate } = req.body;
    let task = new Task({ title, description, dueDate });
    task = await task.save();
    res.send(task);
});

//get a task by id
router.get('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching task', error });
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(task);
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.send(task);
});



module.exports = router;