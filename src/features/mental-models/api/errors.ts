export class MentalModelNotFoundError extends Error {
  status = 404;

  constructor(id: string) {
    super(`Mental model with id ${id} not found`);
    this.name = "MentalModelNotFoundError";
  }
}

export class BookNotFoundError extends Error {
  status = 404;

  constructor(id: string) {
    super(`Book with id ${id} not found`);
    this.name = "BookNotFoundError";
  }
}

export class UnauthorizedError extends Error {
  status = 401;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends Error {
  status = 400;

  constructor(message: string = "Validation error") {
    super(message);
    this.name = "ValidationError";
  }
}
