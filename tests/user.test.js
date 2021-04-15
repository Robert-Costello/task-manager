const request = require('supertest');
const User = require('../src/db/models/user');
const app = require('../src/server/app');
const mongoose = require('mongoose');
const user1 = {name: 'Sam', email: 'sam@mail.com', password: 'p!!222hemr1'};

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany();
  await new User(user1).save();
});

test('Should sign up a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Robert',
      email: 'robert@mail.com',
      password: 'psswrd2221',
    })
    .expect(201);
});
