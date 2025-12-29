import { eq } from "drizzle-orm";
import { getDb, DatabaseError } from "~/db";
import { mentalModels, actionPlans } from "~/db/schema";
import { MentalModelNotFoundError } from "~/features/mental-models/api/errors";
import { ActionPlanNotFoundError } from "~/features/action-plans/api/errors";
import type { ActionPlanModel } from "~/features/action-plans/api/model";

export abstract class ActionPlanService {
  static async create(params: ActionPlanModel.CreateRequestParams) {
    try {
      const { mentalModelId, content } = params;
      const db = getDb();

      const mentalModel = await db.query.mentalModels.findFirst({
        where: eq(mentalModels.id, mentalModelId),
      });

      if (!mentalModel) {
        throw new MentalModelNotFoundError(mentalModelId);
      }

      const insertedActionPlans = await db
        .insert(actionPlans)
        .values({
          mentalModelId,
          content,
        })
        .returning();

      if (!insertedActionPlans[0]) {
        throw new DatabaseError("Failed to create action plan");
      }

      return {
        ...insertedActionPlans[0],
        createdAt: insertedActionPlans[0].createdAt.toISOString(),
        updatedAt: insertedActionPlans[0].updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof MentalModelNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create action plan",
      );
    }
  }

  static async update(params: ActionPlanModel.UpdateRequestParams) {
    try {
      const { id, content } = params;
      const db = getDb();

      const existingActionPlan = await db.query.actionPlans.findFirst({
        where: eq(actionPlans.id, id),
      });

      if (!existingActionPlan) {
        throw new ActionPlanNotFoundError(id);
      }

      await db
        .update(actionPlans)
        .set({
          content,
        })
        .where(eq(actionPlans.id, id));

      const updatedActionPlan = await db.query.actionPlans.findFirst({
        where: eq(actionPlans.id, id),
      });

      if (!updatedActionPlan) {
        throw new ActionPlanNotFoundError(id);
      }

      return {
        ...updatedActionPlan,
        createdAt: updatedActionPlan.createdAt.toISOString(),
        updatedAt: updatedActionPlan.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof ActionPlanNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to update action plan",
      );
    }
  }

  static async delete(params: ActionPlanModel.DeleteRequestParams) {
    try {
      const { id } = params;
      const db = getDb();

      const existingActionPlan = await db.query.actionPlans.findFirst({
        where: eq(actionPlans.id, id),
      });

      if (!existingActionPlan) {
        throw new ActionPlanNotFoundError(id);
      }

      await db.delete(actionPlans).where(eq(actionPlans.id, id));

      return { success: true };
    } catch (error) {
      if (error instanceof ActionPlanNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete action plan",
      );
    }
  }

  static async getByMentalModelId(params: ActionPlanModel.GetByMentalModelIdRequestParams) {
    try {
      const { mentalModelId } = params;
      const db = getDb();

      const results = await db.query.actionPlans.findMany({
        where: eq(actionPlans.mentalModelId, mentalModelId),
        orderBy: [actionPlans.createdAt],
      });

      return results.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }));
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get action plans",
      );
    }
  }
}
