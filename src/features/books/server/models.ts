import { t } from "elysia";
import { createSelectSchema, createInsertSchema } from "drizzle-typebox";
import { books } from "~/db/schema";
import type { MentalModelModel } from "~/features/mental-models/server/model";

const bookSelectSchema = createSelectSchema(books);
const bookInsertSchema = createInsertSchema(books);

export namespace BookModel {
  // Create body - pick only the fields needed for creation
  export const createBody = t.Pick(bookInsertSchema, [
    "googleBookId",
    "title",
    "authors",
    "thumbnailUrl",
    "description",
  ]);
  export type createBody = typeof createBody.static;

  export const response = t.Object({
    ...bookSelectSchema.properties,
    createdAt: t.String(),
  });
  export type response = typeof response.static;

  // Params
  export const params = t.Object({
    id: t.String(),
  });
  export type params = typeof params.static;

  export type GetByIdRequestParams = Pick<typeof bookSelectSchema.static, "id">;
  export type GetOrCreateRequestParams = Omit<typeof bookInsertSchema.static, "id" | "createdAt">;

  // Error responses
  export const databaseError = t.Object({
    error: t.String(),
    code: t.Literal("DATABASE_ERROR"),
  });
  export type databaseError = typeof databaseError.static;

  export const bookNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("BOOK_NOT_FOUND"),
  });
  export type bookNotFoundError = typeof bookNotFoundError.static;

  export const validationError = t.Object({
    error: t.String(),
    code: t.Literal("VALIDATION_ERROR"),
  });
  export type validationError = typeof validationError.static;
}

// Google Books API response schemas
export namespace GoogleBooksModel {
  // Google Books API types
  export type GoogleBooksVolume = {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      description?: string;
      industryIdentifiers?: Array<Record<"type" | "identifier", string>>;
      pageCount?: number;
      categories?: string[];
      imageLinks?: Partial<Record<"smallThumbnail" | "thumbnail", string>>;
      language?: string;
    };
  };

  export interface GoogleBooksSearchResponse {
    kind: string;
    totalItems: number;
    items?: GoogleBooksVolume[];
  }

  export interface BookSearchResult {
    googleBookId: string;
    title: string;
    authors: string | null;
    thumbnailUrl: string | null;
    description: string | null;
    publisher: string | null;
    publishedDate: string | null;
    pageCount: number | null;
  }

  export const searchResult = t.Object({
    googleBookId: t.String(),
    title: t.String(),
    authors: t.Nullable(t.String()),
    thumbnailUrl: t.Nullable(t.String()),
    description: t.Nullable(t.String()),
    publisher: t.Nullable(t.String()),
    publishedDate: t.Nullable(t.String()),
    pageCount: t.Nullable(t.Number()),
  });
  export type searchResult = typeof searchResult.static;

  export const searchQuery = t.Object({
    q: t.String({ description: "Search query" }),
    maxResults: t.Optional(
      t.Number({
        description: "Maximum number of results",
        default: 10,
        minimum: 1,
        maximum: 40,
      }),
    ),
  });
  export type searchQuery = typeof searchQuery.static;

  export const searchParams = t.Object({
    id: t.String({ description: "Google Book ID" }),
  });
  export type searchParams = typeof searchParams.static;

  export type SearchRequestParams = {
    userId: MentalModelModel.GetByIdRequestParams["userId"];
    query: typeof searchQuery.properties.q.static;
    maxResults?: typeof searchQuery.properties.maxResults.static;
  };

  export type GetByIdRequestParams = Pick<typeof bookSelectSchema.static, "googleBookId">;

  export const apiError = t.Object({
    error: t.String(),
    code: t.Literal("GOOGLE_BOOKS_API_ERROR"),
  });
  export type apiError = typeof apiError.static;
}
