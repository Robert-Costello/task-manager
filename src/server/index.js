const express = require('express');
require('../db/mongoose');
const User = require('../models/user');
const Task = require('../models/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send('Task not found.');
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/tasks', async (req, res) => {
  const {description, completed} = req.body;

  try {
    const task = new Task({description, completed});
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);

    if (!user) return res.status(404).send('User not found.');

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/users', async (req, res) => {
  const {name, email, password} = req.body;
  const user = new User({name, email, password});

  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
