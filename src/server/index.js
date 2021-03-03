const express = require('express');
require('../db/mongoose');
const User = require('../models/user');
const Task = require('../models/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).send('Task not found.');
      }
      res.send(task);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

app.post('/tasks', (req, res) => {
  const {description, completed} = req.body;

  const task = new Task({description, completed});

  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((e) => res.status(400).send(e));
});

app.get('/users', async (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => res.status(500).send(e));
});

app.get('/users/:id', async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found.');
      }
      res.send(user);
    })
    .catch((e) => res.status(500).send(e));
});

app.post('/users', async (req, res) => {
  const {name, email, password} = req.body;
  const user = new User({name, email, password});
  user
    .save()
    .then(() => res.status(201).send(user))
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
