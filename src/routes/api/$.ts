import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { mentalModelsPlugin } from "~/features/mental-models/server";
import { booksPlugin, googleBooksPlugin } from "~/features/books/server";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { treaty } from "@elysiajs/eden";

const app = new Elysia({ prefix: "/api" })
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
          { name: "Books", description: "Book management" },
          { name: "Google Books", description: "Google Books API integration" },
        ],
      },
    }),
  )
  .use(mentalModelsPlugin)
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

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<typeof app>(import.meta.env.VITE_APP_URL || "http://localhost:5173").api);
