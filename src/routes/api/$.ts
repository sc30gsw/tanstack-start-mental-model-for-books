import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { mentalModelsPlugin } from "~/features/mental-models/api";
import { likesPlugin } from "~/features/likes/api";
import { actionPlansPlugin } from "~/features/action-plans/api";
import { booksPlugin, googleBooksPlugin } from "~/features/books/api";
import { createFileRoute } from "@tanstack/react-router";

export const app = new Elysia({ prefix: "/api" })
  .use(
    openapi({
      path: import.meta.env.DEV ? "/openapi" : undefined,
      documentation: {
        info: {
          title: "Mental Model for Books API",
          version: "1.0.0",
          description: "API for managing reading mental models",
        },
        tags: [
          { name: "Mental Models", description: "Mental model CRUD operations" },
          { name: "Likes", description: "Like operations" },
          { name: "Action Plans", description: "Action plan operations" },
          { name: "Books", description: "Book management" },
          { name: "Google Books", description: "Google Books API integration" },
        ],
      },
    }),
  )
  .use(mentalModelsPlugin)
  .use(likesPlugin)
  .use(actionPlansPlugin)
  .use(booksPlugin)
  .use(googleBooksPlugin);

const handle = ({ request }: { request: Request }) => {
  return app.fetch(request);
};

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
});
