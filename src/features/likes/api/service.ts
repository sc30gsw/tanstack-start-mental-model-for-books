import { eq, and } from "drizzle-orm";
import { getDb, DatabaseError } from "~/db";
import { mentalModels, likes } from "~/db/schema";
import { MentalModelNotFoundError } from "~/features/mental-models/api/errors";
import { LikeNotFoundError } from "./errors";
import type { LikeModel } from "./model";

export abstract class LikeService {
  static async create(params: LikeModel.CreateRequestParams) {
    try {
      const { mentalModelId, userId } = params;
      const db = getDb();

      const mentalModel = await db.query.mentalModels.findFirst({
        where: eq(mentalModels.id, mentalModelId),
      });

      if (!mentalModel) {
        throw new MentalModelNotFoundError(mentalModelId);
      }

      const existingLike = await db.query.likes.findFirst({
        where: and(eq(likes.mentalModelId, mentalModelId), eq(likes.userId, userId)),
      });

      if (existingLike) {
        return {
          mentalModelId: existingLike.mentalModelId,
          userId: existingLike.userId,
          createdAt: existingLike.createdAt.toISOString(),
        };
      }

      const insertedLikes = await db
        .insert(likes)
        .values({
          mentalModelId,
          userId,
        })
        .returning();

      if (!insertedLikes[0]) {
        throw new DatabaseError("Failed to create like");
      }

      return {
        mentalModelId: insertedLikes[0].mentalModelId,
        userId: insertedLikes[0].userId,
        createdAt: insertedLikes[0].createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof MentalModelNotFoundError) {
        throw error;
      }

      throw new DatabaseError(error instanceof Error ? error.message : "Failed to create like");
    }
  }

  static async delete(params: LikeModel.DeleteRequestParams) {
    try {
      const { mentalModelId, userId } = params;
      const db = getDb();

      const existingLike = await db.query.likes.findFirst({
        where: and(eq(likes.mentalModelId, mentalModelId), eq(likes.userId, userId)),
      });

      if (!existingLike) {
        throw new LikeNotFoundError(mentalModelId, userId);
      }

      await db
        .delete(likes)
        .where(and(eq(likes.mentalModelId, mentalModelId), eq(likes.userId, userId)));

      return { success: true };
    } catch (error) {
      if (error instanceof LikeNotFoundError) {
        throw error;
      }

      throw new DatabaseError(error instanceof Error ? error.message : "Failed to delete like");
    }
  }

  static async getLikedMentalModels(params: LikeModel.listParams) {
    const { userId } = params;

    try {
      const db = getDb();

      const userLikes = await db.query.likes.findMany({
        where: eq(likes.userId, userId),
        with: {
          mentalModel: {
            with: {
              book: true,
              likes: true,
            },
          },
        },
        orderBy: [likes.createdAt],
      });

      return userLikes.map((like) => {
        const mentalModel = like.mentalModel;
        const { createdAt: _, ...bookWithoutCreatedAt } = mentalModel.book;
        const likesCount = mentalModel.likes?.length ?? 0;
        const likedByCurrentUser = true;

        return {
          ...mentalModel,
          createdAt: mentalModel.createdAt.toISOString(),
          updatedAt: mentalModel.updatedAt.toISOString(),
          book: bookWithoutCreatedAt,
          likedByCurrentUser,
          likesCount,
        };
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get liked mental models",
      );
    }
  }
}
