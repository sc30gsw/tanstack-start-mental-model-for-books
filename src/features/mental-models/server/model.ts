import { t } from "elysia";
import { createSelectSchema, createInsertSchema } from "drizzle-typebox";
import { mentalModels } from "~/db/schema";

const mentalModelSelectSchema = createSelectSchema(mentalModels);
const mentalModelInsertSchema = createInsertSchema(mentalModels);

export namespace MentalModelModel {
  export const status = t.Union([t.Literal("reading"), t.Literal("completed")]);

  export const createBody = t.Object({
    bookId: t.String(),
    status: t.Optional(status),
    whyReadAnswer1: t.String(),
    whyReadAnswer2: t.Optional(t.String()),
    whyReadAnswer3: t.Optional(t.String()),
    whatToGainAnswer1: t.Optional(t.String()),
    whatToGainAnswer2: t.Optional(t.String()),
    whatToGainAnswer3: t.Optional(t.String()),
    goalAfterReadingAnswer1: t.Optional(t.String()),
    goalAfterReadingAnswer2: t.Optional(t.String()),
    goalAfterReadingAnswer3: t.Optional(t.String()),
  });
  export type createBody = typeof createBody.static;

  export const updateBody = t.Partial(
    t.Omit(mentalModelInsertSchema, ["id", "userId", "bookId", "createdAt", "updatedAt"]),
  );
  export type updateBody = typeof updateBody.static;

  export const params = t.Object({
    id: t.String(),
  });
  export type params = typeof params.static;

  export const response = t.Object({
    ...mentalModelSelectSchema.properties,
    createdAt: t.String(),
    updatedAt: t.String(),
    book: t.Object({
      id: t.String(),
      googleBookId: t.String(),
      title: t.String(),
      authors: t.Nullable(t.String()),
      thumbnailUrl: t.Nullable(t.String()),
      description: t.Nullable(t.String()),
    }),
  });
  export type response = typeof response.static;

  export const listResponse = t.Array(response);
  export type listResponse = typeof listResponse.static;

  export const deleteResponse = t.Object({
    success: t.Boolean(),
  });
  export type deleteResponse = typeof deleteResponse.static;

  export type GetAllRequestParams = {
    userId: typeof mentalModelSelectSchema.properties.userId.static;
  };

  export type GetByIdRequestParams = {
    id: typeof mentalModelSelectSchema.properties.id.static;
    userId: typeof mentalModelSelectSchema.properties.userId.static;
  };

  export type CreateRequestParams = {
    userId: typeof mentalModelSelectSchema.properties.userId.static;
    data: Omit<typeof mentalModelInsertSchema.static, "id" | "userId" | "createdAt" | "updatedAt">;
  };

  export type UpdateRequestParams = {
    id: typeof mentalModelSelectSchema.properties.id.static;
    userId: typeof mentalModelSelectSchema.properties.userId.static;
    data: Partial<
      Omit<
        typeof mentalModelInsertSchema.static,
        "id" | "userId" | "bookId" | "createdAt" | "updatedAt"
      >
    >;
  };

  export type DeleteRequestParams = {
    id: typeof mentalModelSelectSchema.properties.id.static;
    userId: typeof mentalModelSelectSchema.properties.userId.static;
  };

  export const databaseError = t.Object({
    error: t.String(),
    code: t.Literal("DATABASE_ERROR"),
  });
  export type databaseError = typeof databaseError.static;

  export const mentalModelNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("MENTAL_MODEL_NOT_FOUND"),
  });
  export type mentalModelNotFoundError = typeof mentalModelNotFoundError.static;

  export const bookNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("BOOK_NOT_FOUND"),
  });
  export type bookNotFoundError = typeof bookNotFoundError.static;

  export const unauthorizedError = t.Object({
    error: t.String(),
    code: t.Literal("UNAUTHORIZED"),
  });
  export type unauthorizedError = typeof unauthorizedError.static;

  export const validationError = t.Object({
    error: t.String(),
    code: t.Literal("VALIDATION_ERROR"),
  });
  export type validationError = typeof validationError.static;
}
