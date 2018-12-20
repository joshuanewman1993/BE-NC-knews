process.env.NODE_ENV = 'test';
const connection = require('../db/connection');

const articlesTests = require('./articles.spec');
const topicsTests = require('./topics.spec');
const usersTests = require('./users.spec');

beforeEach(() => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection.seed.run()));

after(() => connection.destroy());

articlesTests();
topicsTests();
usersTests();
