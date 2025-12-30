import { Elysia } from "elysia";
import { MentalModelModel } from "./model";
import { MentalModelService } from "./service";
import { MentalModelNotFoundError, BookNotFoundError } from "./errors";
import { sessionMiddleware } from "~/lib/session-middleware";

export const mentalModelsPlugin = new Elysia({ prefix: "/mental-models", name: "mental-models" })
  .use(sessionMiddleware)
  .error({
    MentalModelNotFoundError,
    BookNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "MentalModelNotFoundError":
        set.status = error.status || 404;

        return {
          error: error.message,
          code: "MENTAL_MODEL_NOT_FOUND",
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
    "/",
    async ({ user }) => {
      return await MentalModelService.getAll({ userId: user.id, currentUserId: user.id });
    },
    {
      response: MentalModelModel.listResponse,
      detail: {
        tags: ["Mental Models"],
        summary: "Get all mental models",
        description: "Get all mental models for the authenticated user",
      },
    },
  )
  .get(
    "/:id",
    async ({ params, user }) => {
      return await MentalModelService.getById({
        id: params.id,
        userId: user.id,
        currentUserId: user.id,
      });
    },
    {
      params: MentalModelModel.params,
      response: MentalModelModel.response,
      detail: {
        tags: ["Mental Models"],
        summary: "Get a mental model",
        description: "Get a specific mental model by ID",
      },
    },
  )
  .post(
    "/",
    async ({ body, user }) => {
      return await MentalModelService.create({
        userId: user.id,
        data: {
          bookId: body.bookId,
          status: body.status ?? "reading",
          whyReadAnswer1: body.whyReadAnswer1,
          whyReadAnswer2: body.whyReadAnswer2 ?? "",
          whyReadAnswer3: body.whyReadAnswer3 ?? "",
          whatToGainAnswer1: body.whatToGainAnswer1 ?? "",
          whatToGainAnswer2: body.whatToGainAnswer2 ?? "",
          whatToGainAnswer3: body.whatToGainAnswer3 ?? "",
          goalAfterReadingAnswer1: body.goalAfterReadingAnswer1 ?? "",
          goalAfterReadingAnswer2: body.goalAfterReadingAnswer2 ?? "",
          goalAfterReadingAnswer3: body.goalAfterReadingAnswer3 ?? "",
        },
      });
    },
    {
      body: MentalModelModel.createBody,
      response: MentalModelModel.response,
      detail: {
        tags: ["Mental Models"],
        summary: "Create a mental model",
        description: "Create a new mental model for the authenticated user",
      },
    },
  )
  .patch(
    "/:id",
    async ({ params, body, user }) => {
      return await MentalModelService.update({ id: params.id, userId: user.id, data: body });
    },
    {
      params: MentalModelModel.params,
      body: MentalModelModel.updateBody,
      response: MentalModelModel.response,
      detail: {
        tags: ["Mental Models"],
        summary: "Update a mental model",
        description: "Update an existing mental model",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      return await MentalModelService.delete({ id: params.id, userId: user.id });
    },
    {
      params: MentalModelModel.params,
      response: MentalModelModel.deleteResponse,
      detail: {
        tags: ["Mental Models"],
        summary: "Delete a mental model",
        description: "Delete a mental model by ID",
      },
    },
  );
