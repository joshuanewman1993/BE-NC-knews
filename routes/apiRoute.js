const apiRouter = require('express').Router();
const topicsRouter = require('./topicRoute');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
