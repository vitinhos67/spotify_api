module.exports = (err, req, res, next) => {
  res.setHeader('Content-type', 'application/json');
  console.log(err.message, err.statusCode);
  if (err.statusCode === 400 || err.statusCode === 404) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  if (err) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  next();
};
