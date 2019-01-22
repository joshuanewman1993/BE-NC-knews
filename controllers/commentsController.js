const connection = require('../db/connection');

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', sort_ascending = false, page = 1,
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
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateByCommentId = (req, res, next) => {
  if (!req.params.article_id) return Promise.reject({ status: 404, msg: 'article_id not found' }); // if no article_id then error our!
  const isValidIncrement = typeof req.body.inc_votes !== 'number';
  if (isValidIncrement) return next({ status: 400, msg: 'incorrect input' });
  connection('comments')
    .where('comment_id', '=', req.params.comment_id)
    .increment('votes', req.body.inc_votes)
    .returning('*')
    .then(([comment]) => {
      res.status(200).send({ comment });
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
