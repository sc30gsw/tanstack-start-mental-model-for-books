import { Elysia, t } from "elysia";
import { LikeModel } from "./model";
import { LikeService } from "./service";
import { LikeNotFoundError } from "./errors";
import { MentalModelNotFoundError } from "~/features/mental-models/api/errors";
import { sessionMiddleware } from "~/lib/session-middleware";

export const likesPlugin = new Elysia({ prefix: "/likes", name: "likes" })
  .use(sessionMiddleware)
  .error({
    LikeNotFoundError,
    MentalModelNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "LikeNotFoundError":
        set.status = error.status || 404;

        return {
          error: error.message,
          code: "LIKE_NOT_FOUND",
        };

      case "MentalModelNotFoundError":
        set.status = error.status || 404;

        return {
          error: error.message,
          code: "MENTAL_MODEL_NOT_FOUND",
        };

      default:
        throw error;
    }
  })
  .post(
    "/mental-models/:mentalModelId",
    async ({ params, user }) => {
      return await LikeService.create({
        mentalModelId: params.mentalModelId,
        userId: user.id,
      });
    },
    {
      params: t.Object({
        mentalModelId: t.String(),
      }),
      response: LikeModel.response,
      detail: {
        tags: ["Likes"],
        summary: "Like a mental model",
        description: "Add a like to a mental model",
      },
    },
  )
  .delete(
    "/mental-models/:mentalModelId",
    async ({ params, user }) => {
      return await LikeService.delete({
        mentalModelId: params.mentalModelId,
        userId: user.id,
      });
    },
    {
      params: t.Object({
        mentalModelId: t.String(),
      }),
      response: t.Object({ success: t.Boolean() }),
      detail: {
        tags: ["Likes"],
        summary: "Unlike a mental model",
        description: "Remove a like from a mental model",
      },
    },
  )
  .get(
    "/mental-models",
    async ({ user }) => {
      return await LikeService.getLikedMentalModels(user.id);
    },
    {
      response: t.Array(t.Any()),
      detail: {
        tags: ["Likes"],
        summary: "Get liked mental models",
        description: "Get all mental models liked by the authenticated user",
      },
    },
  );
