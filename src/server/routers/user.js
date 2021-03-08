const express = require('express');
const router = new express.Router();
const User = require('../../db/models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
  try {
    const {name, email, password, age} = req.body;
    const user = new User({name, email, password, age});
    await user.save();
    const token = await user.generateAuthToken();
    console.log('Post user save');
    res.status(201).send({user, token});
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({user, token});
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    const user = req.user;
    const token = req.token;
    user.tokens = user.tokens.filter((t) => t.token !== token);

    await user.save();

    if (!user) throw new Error();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];

    await user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  try {
    const user = req.user;
    console.log('req.user:', req.user);
    if (!user) throw new Error();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('User not found.');
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
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowed = new Set(['name', 'age', 'password', 'email']);
  const isValid = updates.every((update) => allowed.has(update));

  if (!isValid) {
    return res.status(400).send('Invalid Update Operation.');
  }

  try {
    const user = await User.findById(_id);

    updates.forEach((updateString) => {
      user[updateString] = req.body[updateString];
    });

    await user.save();
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    //   useFindAndModify: false,
    // });

    if (!user) return res.status(404).send('User not found.');

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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
