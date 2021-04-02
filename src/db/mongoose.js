const mongoose = require('mongoose');
const connectionURL = process.env.MONGODG_URL;

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
