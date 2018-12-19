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
      'comments.article_id',
    )
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(next);
};
