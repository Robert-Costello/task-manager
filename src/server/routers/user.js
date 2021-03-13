const express = require('express');
const router = new express.Router();
const User = require('../../db/models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return callback(new Error('Please upload an image.'));
    }

    callback(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  upload.single('avatar'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({error: error.message});
  }
);

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

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = new Set(['name', 'age', 'password', 'email']);
  const isValid = updates.every((update) => allowed.has(update));

  if (!isValid) {
    return res.status(400).send('Invalid Update Operation.');
  }

  try {
    const user = req.user;
    updates.forEach((updateString) => {
      user[updateString] = req.body[updateString];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
