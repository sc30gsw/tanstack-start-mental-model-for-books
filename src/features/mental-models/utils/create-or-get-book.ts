import type { Session } from "@workos/authkit-tanstack-react-start";
import type { BookModel } from "~/features/books/api/models";
import { api } from "~/lib/rpc";

export async function createOrGetBook(book: BookModel.createBody, userId: Session["user"]["id"]) {
  const response = await api.books.post(book, {
    headers: {
      authorization: userId,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.error?.value?.message || "Failed to create book");
  }

  if (!response.data) {
    throw new Error("Failed to create book: no data returned");
  }

  return response.data;
}
