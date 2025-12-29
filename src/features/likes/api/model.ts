import { t } from "elysia";
import { createSelectSchema, createInsertSchema } from "drizzle-typebox";
import { likes } from "~/db/schema";

const likeSelectSchema = createSelectSchema(likes);
const likeInsertSchema = createInsertSchema(likes);

export namespace LikeModel {
  export const params = t.Object({
    mentalModelId: t.String(),
  });
  export type params = typeof params.static;

  export const response = t.Object({
    ...likeSelectSchema.properties,
    createdAt: t.String(),
  });
  export type response = typeof response.static;

  export type CreateRequestParams = Pick<
    typeof likeInsertSchema.static,
    "mentalModelId" | "userId"
  >;

  export type DeleteRequestParams = Pick<
    typeof likeInsertSchema.static,
    "mentalModelId" | "userId"
  >;

  export const databaseError = t.Object({
    error: t.String(),
    code: t.Literal("DATABASE_ERROR"),
  });
  export type databaseError = typeof databaseError.static;

  export const likeNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("LIKE_NOT_FOUND"),
  });
  export type likeNotFoundError = typeof likeNotFoundError.static;
}
