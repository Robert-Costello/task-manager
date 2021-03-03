const Task = require('../../models/task');
const express = require('express');

const router = new express.Router();

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send('Task not found.');
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowed = new Set(['completed', 'description']);

  const isValid = updates.every((update) => allowed.has(update));
  if (!isValid) return res.status(400).send('Invalid update operation');

  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!task) return res.status(404).send('Task not found.');
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/tasks', async (req, res) => {
  const {description, completed} = req.body;

  try {
    const task = new Task({description, completed});
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) return res.status(404).send('Task not found.');

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
