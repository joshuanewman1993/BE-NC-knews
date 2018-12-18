const apiRouter = require('express').Router();
const topicsRouter = require('./topicRoute');
const articlesRouter = require('./articleRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
