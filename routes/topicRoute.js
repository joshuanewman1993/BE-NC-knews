const topicsRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticleByTopicId,
  addArticleByTopicId,
} = require('../controllers/topicsController');

const { handle405, handle422 } = require('../errors/index');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(getArticleByTopicId)
  .post(addArticleByTopicId)
  .all(handle405);

module.exports = topicsRouter;
