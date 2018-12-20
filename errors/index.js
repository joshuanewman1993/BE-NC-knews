exports.handle404 = (err, req, res, next) => {
  //   console.log(err, 'err');
  if (err.status === 404) res.status(404).send({ msg: err.msg });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const codes = {
    '22P02': 'invalid input syntax for integer',
    42703: 'column does not exist',
  };
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: err.msg });
};
