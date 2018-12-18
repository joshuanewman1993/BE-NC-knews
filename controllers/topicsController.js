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
  connection
    .select('*')
    .from('articles')
    .join('topics', 'topics.slug', '=', 'articles.topic')
    .where('topics.slug', '=', req.params.topic)
    .then((data) => {
      res.send({ data });
    })
    .catch(next);
};
