import { Elysia, t } from "elysia";
import { GoogleBooksService } from "~/features/books/server/service";
import { GoogleBooksModel } from "~/features/books/server/models";
import { GoogleBooksApiError, BookNotFoundError } from "~/features/books/server/error";
import { BookService } from "./service";
import { BookModel } from "./models";
import { sessionMiddleware } from "~/lib/session-middleware";

export const googleBooksPlugin = new Elysia({ prefix: "/google-books", name: "google-books" })
  .use(sessionMiddleware)
  .error({
    GoogleBooksApiError,
    BookNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "GoogleBooksApiError":
        set.status = error.status || 500;
        return {
          error: error.message,
          code: "GOOGLE_BOOKS_API_ERROR",
        };

      case "BookNotFoundError":
        set.status = error.status || 404;
        return {
          error: error.message,
          code: "BOOK_NOT_FOUND",
        };

      default:
        throw error;
    }
  })
  .get(
    "/search",
    async ({ query }) => {
      return await GoogleBooksService.search({
        query: query.q,
        maxResults: query.maxResults,
      });
    },
    {
      query: GoogleBooksModel.searchQuery,
      response: t.Array(GoogleBooksModel.searchResult),
      detail: {
        tags: ["Google Books"],
        summary: "Search books",
        description: "Search for books using Google Books API",
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const book = await GoogleBooksService.getById({ googleBookId: params.id });

      if (!book) {
        set.status = 404;
        return {
          error: "Book not found",
          code: "GOOGLE_BOOKS_API_ERROR",
        };
      }
      return book;
    },
    {
      params: GoogleBooksModel.searchParams,
      response: t.Union([GoogleBooksModel.searchResult, GoogleBooksModel.apiError]),
      detail: {
        tags: ["Google Books"],
        summary: "Get book by ID",
        description: "Get a specific book by its Google Books ID",
      },
    },
  );

export const booksPlugin = new Elysia({ prefix: "/books", name: "books" })
  .use(sessionMiddleware)
  .error({
    BookNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "BookNotFoundError":
        set.status = error.status || 404;

        return {
          error: error.message,
          code: "BOOK_NOT_FOUND",
        };

      default:
        throw error;
    }
  })
  .post(
    "/",
    async ({ body }) => {
      return await BookService.getOrCreate({
        googleBookId: body.googleBookId,
        title: body.title,
        authors: body.authors,
        thumbnailUrl: body.thumbnailUrl,
        description: body.description,
      });
    },
    {
      body: BookModel.createBody,
      response: BookModel.response,
      detail: {
        tags: ["Books"],
        summary: "Create or get book",
        description: "Create a new book or return existing one by Google Book ID",
      },
    },
  )
  .get(
    "/:id",
    async ({ params }) => {
      return await BookService.getById({ id: params.id });
    },
    {
      params: BookModel.params,
      response: BookModel.response,
      detail: {
        tags: ["Books"],
        summary: "Get a book",
        description: "Get a book by its internal ID",
      },
    },
  );
