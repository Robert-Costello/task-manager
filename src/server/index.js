const express = require('express');
require('../db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   res.status(503).send('Site under maintainance. Please try again soon!');
// });

app.use(express.json());
app.use(userRouter, taskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const Task = require('../db/models/task');
const User = require('../db/models/user');

const main = async () => {
  // const task = await Task.findById('604943924a45f55660065559');
  // await task.populate('owner').execPopulate();
  // console.log(task);
  const user = await User.findById('604941d9de353a55eaa8ae5c');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
};

// main();
