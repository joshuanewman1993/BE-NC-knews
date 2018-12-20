const usersRouter = require('express').Router();
const { handle405 } = require('../errors/index');
const { getUsers, getUsersByUsername } = require('../controllers/usersController');

usersRouter
  .route('/')
  .get(getUsers)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(getUsersByUsername)
  .all(handle405);

module.exports = usersRouter;
