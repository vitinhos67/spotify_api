const { InvalidArgumentError } = require('../../model/errors');

module.exports = (err, req, res) => {
  if (err) {
    if (err instanceof InvalidArgumentError) {
      return res.status(403).json({
        message: err.message,
        statusCode: 403,
      });
    }

    res.json({
      message: err.message,
    });
  }
};
