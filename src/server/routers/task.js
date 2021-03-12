const express = require('express');
const Task = require('../../db/models/task');
const User = require('../../db/models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const {description, completed} = req.body;
  const owner = req.user._id;
  try {
    const task = new Task({description, completed, owner});
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true' ? true : false;
  }
  try {
    await req.user.populate({path: 'tasks', match}).execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({_id, owner: req.user._id});
    if (!task) return res.status(404).send('Task not found.');
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowed = new Set(['completed', 'description']);
  const isValid = updates.every((update) => allowed.has(update));

  if (!isValid) return res.status(400).send('Invalid update operation');

  try {
    const task = await Task.findOne({_id, owner: req.user._id});

    if (!task) return res.status(404).send('Task not found.');

    updates.forEach(
      (updateString) => (task[updateString] = req.body[updateString])
    );

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({_id, owner: req.user._id});

    if (!task) return res.status(404).send('Task not found.');

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
