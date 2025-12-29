import { t } from "elysia";
import { createSelectSchema, createInsertSchema } from "drizzle-typebox";
import { actionPlans } from "~/db/schema";

const actionPlanSelectSchema = createSelectSchema(actionPlans);
const actionPlanInsertSchema = createInsertSchema(actionPlans);

export namespace ActionPlanModel {
  export const createBody = t.Pick(actionPlanInsertSchema, ["mentalModelId", "content"]);
  export type createBody = typeof createBody.static;

  export const updateBody = t.Partial(t.Pick(actionPlanInsertSchema, ["content"]));
  export type updateBody = typeof updateBody.static;

  export const params = t.Object({
    id: t.String(),
  });
  export type params = typeof params.static;

  export const response = t.Object({
    ...actionPlanSelectSchema.properties,
    createdAt: t.String(),
    updatedAt: t.String(),
  });
  export type response = typeof response.static;

  export const listResponse = t.Array(response);
  export type listResponse = typeof listResponse.static;

  export const deleteResponse = t.Object({
    success: t.Boolean(),
  });
  export type deleteResponse = typeof deleteResponse.static;

  export type CreateRequestParams = Pick<
    typeof actionPlanInsertSchema.static,
    "mentalModelId" | "content"
  >;

  export type UpdateRequestParams = {
    id: typeof actionPlanSelectSchema.static.id;
    content: typeof actionPlanInsertSchema.static.content;
  };

  export type DeleteRequestParams = Pick<typeof actionPlanSelectSchema.static, "id">;

  export type GetByMentalModelIdRequestParams = Pick<
    typeof actionPlanSelectSchema.static,
    "mentalModelId"
  >;

  export const databaseError = t.Object({
    error: t.String(),
    code: t.Literal("DATABASE_ERROR"),
  });
  export type databaseError = typeof databaseError.static;

  export const actionPlanNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("ACTION_PLAN_NOT_FOUND"),
  });
  export type actionPlanNotFoundError = typeof actionPlanNotFoundError.static;
}
