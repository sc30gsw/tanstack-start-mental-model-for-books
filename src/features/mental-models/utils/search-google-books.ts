import { api } from "~/lib/rpc";
import type { GoogleBooksModel } from "~/features/books/api/models";

export type BookSearchResult = GoogleBooksModel.BookSearchResult;

export async function searchGoogleBooks(
  userId: GoogleBooksModel.SearchRequestParams["userId"],
  query: GoogleBooksModel.SearchRequestParams["query"],
  maxResults?: GoogleBooksModel.SearchRequestParams["maxResults"],
) {
  const response = await api["google-books"].search.get({
    headers: {
      authorization: userId,
    },
    query: { q: query, maxResults },
  });

  if (response.status !== 200) {
    throw new Error(response.error?.value?.message || "Failed to search books");
  }

  return response.data ?? [];
}
