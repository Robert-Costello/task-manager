const express = require('express');
require('../db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.status(400).send('GET requests are disabled');
//   } else next();
// });

// app.use((req, res, next) => {
//   res.status(503).send('Site under maintainance. Please try again soon!');
// });

app.use(express.json());
app.use(userRouter, taskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const jwt = require('jsonwebtoken');

const fun = async () => {
  try {
    const token = jwt.sign({_id: '123'}, 'hereissomethings', {
      expiresIn: '1 second',
    });
    console.log('token', token);
    const data = jwt.verify(token, 'hereissomethings');
    console.log('data', data);
  } catch (error) {
    console.log('Login unsuccessful.');
  }
};

// fun();
