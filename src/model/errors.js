class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InvalidArgumentError';
  }
}
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'InternalServerError';
  }
}
class ValueNotFound extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ValueNotFound';
  }
}

class ValueAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ValueNotFound';
  }
}

module.exports = {
  InvalidArgumentError, ValueNotFound, InternalServerError, ValueAlreadyExists,
};
