const connection = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', sort_ascending = false, page = 1,
  } = req.query;
  connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .limit(limit)
    .offset(limit * (page - 1))
    .orderBy(`articles.${sort_by}`, sort_ascending ? 'asc' : 'desc')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'comments.article_id',
    )
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', sort_ascending = false, page = 1,
  } = req.query;
  connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'articles.topic',
    )
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .where('articles.article_id', '=', req.params.article_id)
    .limit(limit)
    .offset(limit * (page - 1))
    .orderBy(`articles.${sort_by}`, sort_ascending ? 'asc' : 'desc')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'articles.body',
      'comments.article_id',
    )
    .then(([articles]) => {
      if (!articles) return Promise.reject({ status: 404, msg: 'article not found! Please try another.' });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  // const isValidIncrement = typeof req.body.inc_votes !== 'number';
  // if (isValidIncrement) return next({ status: 400, msg: 'incorrect input' });
  connection('articles')
    .where('article_id', '=', req.params.article_id)
    .increment('votes', req.body.inc_votes)
    .returning('*')
    .then(([updatedArticle]) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  connection('articles')
    .where('article_id', '=', req.params.article_id)
    .del()
    .then((deletedArticle) => {
      if (!deletedArticle) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(204).send({});
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', sort_ascending = false, page = 0,
  } = req.query;
  connection
    .select(
      'comment_id',
      'comments.votes',
      'comments.created_at',
      'articles.username AS author',
      'comments.body',
    )
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .where('articles.article_id', '=', req.params.article_id)
    .limit(limit)
    .offset(limit * (page - 1))
    .orderBy(`${sort_by}`, sort_ascending ? 'asc' : 'desc')
    .then((comments) => {
      if (!comments) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticle = (req, res, next) => {
  const newObj = { ...req.params, ...req.body };
  connection
    .insert(newObj)
    .into('comments')
    .returning('*')
    .then(([commentAdded]) => {
      res.status(201).send({ commentAdded });
    })
    .catch(next);
};

exports.updateByCommentId = (req, res, next) => {
  const isValidIncrement = typeof req.body.inc_votes !== 'number';
  if (isValidIncrement) return next({ status: 400, msg: 'incorrect input' });
  connection('comments')
    .where('comment_id', '=', req.params.comment_id)
    .increment('votes', req.body.inc_votes)
    .returning('*')
    .then(([comment]) => {
      res.status(200).send(comment);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  connection('comments')
    .where('comment_id', '=', req.params.comment_id)
    .del()
    .then((comment) => {
      if (!comment) return Promise.reject({ status: 404, msg: 'comment not found' });
      res.status(204).send({});
    })
    .catch(next);
};

// const isValidIncrement = typeof req.body.inc_votes !== 'number';
// let newVote = req.body;
// if (newVote.inc_votes === undefined) {
//   newVote = { inc_votes: 0 };
// }
