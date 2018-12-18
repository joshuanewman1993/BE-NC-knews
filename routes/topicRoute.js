const topicsRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticleByTopicId,
  addArticleByTopicId,
} = require('../controllers/topicsController');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', addTopic);
topicsRouter.get('/:topic/articles', getArticleByTopicId);
topicsRouter.post('/:topic/articles,', addArticleByTopicId);

module.exports = topicsRouter;
