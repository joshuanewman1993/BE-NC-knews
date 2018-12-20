const apiRouter = require('express').Router();
const topicsRouter = require('./topicRoute');
const articlesRouter = require('./articleRouter');
const usersRouter = require('../routes/userRouter');
const readFile = require('../readFile');

apiRouter.get('/', readFile);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
