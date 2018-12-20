const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controllers/articlesController');
const {
  getCommentsByArticleId,
  postCommentByArticle,
  updateByCommentId,
  deleteCommentById,
} = require('../controllers/commentsController');

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
  .post(postCommentByArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateByCommentId)
  .delete(deleteCommentById)
  .all(handle405);

module.exports = articlesRouter;
