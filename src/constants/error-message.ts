export const ERROR_STATUS = {
  UNAUTHORIZED: "Unauthorized",
  USER_NOT_FOUND: "User not found",
  MENTAL_MODEL_NOT_FOUND: "Mental model not found",
  BOOK_NOT_FOUND: "Book not found",
  DATABASE_ERROR: "Database error occurred",
  VALIDATION_ERROR: "Validation error",
  GOOGLE_BOOKS_API_ERROR: "Google Books API error occurred",
} as const satisfies Record<string, string>;
