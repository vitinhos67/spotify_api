class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InvalidArgumentError';
    this.statusCode = 403;
  }
}
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}
class ValueNotFound extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 404;
    this.name = 'ValueNotFound';
  }
}

class ValueAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ValueAlreadyExists';
    this.statusCode = 400;
  }
}

class SyntaxError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'SyntaxError';
    this.statusCode = 401;
  }
}

module.exports = {
  InvalidArgumentError,
  ValueNotFound,
  InternalServerError,
  ValueAlreadyExists,
  SyntaxError,
};
