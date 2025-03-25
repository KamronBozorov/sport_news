const errorHandler = (err, res) => {
  console.log(err);
  res.status(400).send({ error: err.message });
};

module.exports = errorHandler;
