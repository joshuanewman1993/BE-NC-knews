const connection = require('../db/connection');

exports.getTopics = (req, res, next) => connection
  .select('*')
  .from('topics')
  .then((topics) => {
    res.status(200).send(topics);
  })
  .catch(next);

exports.addTopic = (req, res, next) => {
  connection
    .returning('*')
    .insert(req.body)
    .into('topics')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.getArticleByTopicId = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', sort_ascending = false, page = 0,
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
    .where('topic', '=', req.params.topic)
    .limit(limit)
    .offset(limit * page)
    .orderBy(`${sort_by}`, sort_ascending ? 'asc' : 'desc')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'comments.article_id',
    )
    .then((data) => {
      if (data.length === 0) return Promise.reject({ status: 404, msg: 'topic not found!' });
      res.status(200).send({ data });
    })
    .catch(next);
};

exports.addArticleByTopicId = (req, res, next) => {
  const newObj = { ...req.params, ...req.body };
  connection
    .insert(newObj)
    .into('articles')
    .returning('*')
    .then(([articleAdded]) => {
      res.status(201).send({ articleAdded });
    })
    .catch(next);
};
