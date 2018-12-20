const connection = require('../db/connection');

exports.getUsers = (req, res, next) => {
  connection
    .select('*')
    .from('users')
    .then((users) => {
      res.status(200).send(users);
    });
};

exports.getUsersByUsername = (req, res, next) => {
  connection
    .select('*')
    .from('users')
    .where('users.username', '=', req.params.username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: 'user not found! Please try another.' });
      res.status(200).send(user);
    })
    .catch(next);
};
