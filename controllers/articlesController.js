const connection = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending = false, page = 0,
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
    .limit(limit)
    .offset(limit * page)
    .orderBy(`articles.${sort_criteria}`, sort_ascending ? 'asc' : 'desc')
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
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending = false, page = 0,
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
    .offset(limit * page)
    .orderBy(`articles.${sort_criteria}`, sort_ascending ? 'asc' : 'desc')
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
    .then((data) => {
      if (data.length === 0) return Promise.reject({ status: 404, msg: 'article not found! Please try another.' });
      res.status(200).send({ data });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const isValidIncrement = typeof req.body.inc_votes !== 'number';
  if (isValidIncrement) return next({ status: 400, msg: 'incorrect input' });

  connection('articles')
    .where('article_id', '=', req.params.article_id)
    .increment('votes', req.body.inc_votes)
    .returning('*')
    .then(([updatedData]) => {
      res.status(200).send(updatedData);
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  connection('articles')
    .where('article_id', '=', req.params.article_id)
    .del()
    .then((article) => {
      if (!article) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({});
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending = false, page = 0,
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
    .offset(limit * page)
    .orderBy(`${sort_criteria}`, sort_ascending ? 'asc' : 'desc')
    .then((data) => {
      if (!data) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ data });
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
    .then(([updatedData]) => {
      res.status(200).send(updatedData);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  connection('comments')
    .where('comment_id', '=', req.params.comment_id)
    .del()
    .then((article) => {
      if (!article) return Promise.reject({ status: 404, msg: 'comment not found' });
      res.status(200).send({});
    })
    .catch(next);
};
