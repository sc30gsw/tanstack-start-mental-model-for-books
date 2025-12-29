import { eq } from "drizzle-orm";
import { getDb, DatabaseError } from "~/db";
import { books } from "~/db/schema";
import { GoogleBooksApiError, BookNotFoundError } from "~/features/books/server/error";
import type { GoogleBooksModel, BookModel } from "~/features/books/server/models";

export abstract class GoogleBooksService {
  private static readonly BASE_URL = "https://www.googleapis.com/books/v1/volumes";

  static async search(params: GoogleBooksModel.SearchRequestParams) {
    try {
      const { query, maxResults = 10 } = params;
      const url = new URL(this.BASE_URL);
      url.searchParams.set("q", query);
      url.searchParams.set("maxResults", maxResults.toString());
      url.searchParams.set("printType", "books");
      url.searchParams.set("langRestrict", "ja");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new GoogleBooksApiError(`Google Books API error: ${response.statusText}`);
      }

      const data: GoogleBooksModel.GoogleBooksSearchResponse = await response.json();

      if (!data.items) {
        return [];
      }

      return data.items.map((item) => this.mapVolumeToResult(item));
    } catch (error) {
      if (error instanceof GoogleBooksApiError) {
        throw error;
      }

      throw new GoogleBooksApiError(
        error instanceof Error ? error.message : "Failed to search books",
      );
    }
  }

  static async getById(params: GoogleBooksModel.GetByIdRequestParams) {
    try {
      const { googleBookId } = params;

      const url = `${this.BASE_URL}/${googleBookId}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }

        throw new GoogleBooksApiError(`Google Books API error: ${response.statusText}`);
      }

      const data: GoogleBooksModel.GoogleBooksVolume = await response.json();

      return this.mapVolumeToResult(data);
    } catch (error) {
      if (error instanceof GoogleBooksApiError) {
        throw error;
      }

      throw new GoogleBooksApiError(
        error instanceof Error ? error.message : "Failed to get book from Google Books API",
      );
    }
  }

  private static mapVolumeToResult(volume: GoogleBooksModel.GoogleBooksVolume) {
    const { volumeInfo } = volume;

    return {
      googleBookId: volume.id,
      title: volumeInfo.title,
      authors: volumeInfo.authors?.join(", ") ?? null,
      thumbnailUrl: volumeInfo.imageLinks?.thumbnail ?? null,
      description: volumeInfo.description ?? null,
      publisher: volumeInfo.publisher ?? null,
      publishedDate: volumeInfo.publishedDate ?? null,
      pageCount: volumeInfo.pageCount ?? null,
    };
  }
}

export abstract class BookService {
  static async getOrCreate(params: BookModel.GetOrCreateRequestParams) {
    try {
      const db = getDb();

      const existing = await db
        .select()
        .from(books)
        .where(eq(books.googleBookId, params.googleBookId))
        .limit(1);

      if (existing.length > 0 && existing[0]) {
        return {
          ...existing[0],
          createdAt: existing[0].createdAt.toISOString(),
        };
      }

      const insertedBooks = await db
        .insert(books)
        .values({
          ...params,
        })
        .returning();

      if (!insertedBooks[0]) {
        throw new BookNotFoundError(params.googleBookId);
      }

      return {
        ...insertedBooks[0],
        createdAt: insertedBooks[0].createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof BookNotFoundError || error instanceof DatabaseError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get or create book",
      );
    }
  }

  static async getById(params: BookModel.GetByIdRequestParams) {
    try {
      const db = getDb();

      const results = await db.select().from(books).where(eq(books.id, params.id)).limit(1);

      if (results.length === 0 || !results[0]) {
        throw new BookNotFoundError(params.id);
      }

      return {
        ...results[0],
        createdAt: results[0].createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(error instanceof Error ? error.message : "Failed to get book");
    }
  }
}
