const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getCommentsByArticleId,
} = require('../controllers/articlesController');
const { handle405 } = require('../errors/index');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .all(handle405);
module.exports = articlesRouter;
