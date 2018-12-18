const connection = require('../db/connection');

exports.getArticles = (req, res, next) => connection
  .select('*')
  .from('articles')
  .then((articles) => {
    res.status(200).send(articles);
  })
  .catch(next);
