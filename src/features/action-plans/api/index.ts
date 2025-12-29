import { Elysia, t } from "elysia";
import { ActionPlanModel } from "./model";
import { ActionPlanService } from "./service";
import { ActionPlanNotFoundError } from "./errors";
import { MentalModelNotFoundError } from "~/features/mental-models/api/errors";
import { sessionMiddleware } from "~/lib/session-middleware";

export const actionPlansPlugin = new Elysia({ prefix: "/action-plans", name: "action-plans" })
  .use(sessionMiddleware)
  .error({
    ActionPlanNotFoundError,
    MentalModelNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "ActionPlanNotFoundError":
        set.status = error.status || 404;

        return {
          error: error.message,
          code: "ACTION_PLAN_NOT_FOUND",
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
  .get(
    "/mental-models/:mentalModelId",
    async ({ params }) => {
      return await ActionPlanService.getByMentalModelId({
        mentalModelId: params.mentalModelId,
      });
    },
    {
      params: t.Object({
        mentalModelId: t.String(),
      }),
      response: ActionPlanModel.listResponse,
      detail: {
        tags: ["Action Plans"],
        summary: "Get action plans for a mental model",
        description: "Get all action plans for a specific mental model",
      },
    },
  )
  .post(
    "/mental-models/:mentalModelId",
    async ({ params, body }) => {
      return await ActionPlanService.create({
        mentalModelId: params.mentalModelId,
        content: body.content,
      });
    },
    {
      params: t.Object({
        mentalModelId: t.String(),
      }),
      body: ActionPlanModel.createBody,
      response: ActionPlanModel.response,
      detail: {
        tags: ["Action Plans"],
        summary: "Create an action plan",
        description: "Create a new action plan for a mental model",
      },
    },
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      return await ActionPlanService.update({
        id: params.id,
        content: body.content ?? "",
      });
    },
    {
      params: ActionPlanModel.params,
      body: ActionPlanModel.updateBody,
      response: ActionPlanModel.response,
      detail: {
        tags: ["Action Plans"],
        summary: "Update an action plan",
        description: "Update an existing action plan",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      return await ActionPlanService.delete({
        id: params.id,
      });
    },
    {
      params: ActionPlanModel.params,
      response: ActionPlanModel.deleteResponse,
      detail: {
        tags: ["Action Plans"],
        summary: "Delete an action plan",
        description: "Delete an action plan by ID",
      },
    },
  );
