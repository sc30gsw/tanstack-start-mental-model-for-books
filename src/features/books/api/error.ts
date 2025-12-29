export class BookNotFoundError extends Error {
  status = 404;

  constructor(id: string) {
    super(`Book with id ${id} not found`);
    this.name = "BookNotFoundError";
  }
}

export class GoogleBooksApiError extends Error {
  status = 500;

  constructor(message: string = "Google Books API error occurred") {
    super(message);
    this.name = "GoogleBooksApiError";
  }
}

export class ValidationError extends Error {
  status = 400;

  constructor(message: string = "Validation error") {
    super(message);
    this.name = "ValidationError";
  }
}
