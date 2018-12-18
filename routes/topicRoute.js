const topicsRouter = require('express').Router();
const { getTopics, addTopic, getArticleByTopicId } = require('../controllers/topicsController');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', addTopic);
topicsRouter.get('/:topic/articles', getArticleByTopicId);

module.exports = topicsRouter;
