const express = require('express');
const router = new express.Router();
const User = require('../../models/user');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = new Set(['name', 'age', 'password', 'email']);
  const isValidOperation = updates.every((update) => allowed.has(update));

  if (!isValidOperation) {
    return res.status(400).send('Invalid Update Operation.');
  }

  try {
    const _id = req.params.id;
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) return res.status(404).send('User not found.');

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/users', async (req, res) => {
  const {name, email, password, age} = req.body;
  const user = new User({name, email, password, age});

  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.status(400).send('User not found');

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
