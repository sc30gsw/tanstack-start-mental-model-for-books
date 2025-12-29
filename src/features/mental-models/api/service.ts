import { eq, and } from "drizzle-orm";
import { getDb, DatabaseError } from "~/db";
import { books, mentalModels } from "~/db/schema";
import { MentalModelNotFoundError, BookNotFoundError } from "~/features/mental-models/api/errors";
import type { MentalModelModel } from "~/features/mental-models/api/model";

export abstract class MentalModelService {
  static async getAll(params: MentalModelModel.GetAllRequestParams) {
    try {
      const { userId } = params;

      const db = getDb();

      const results = await db
        .select()
        .from(mentalModels)
        .innerJoin(books, eq(mentalModels.bookId, books.id))
        .where(eq(mentalModels.userId, userId))
        .orderBy(mentalModels.createdAt);

      return results.map((row) => {
        const { createdAt: _, ...bookWithoutCreatedAt } = row.books;
        return {
          ...row.mental_models,
          createdAt: row.mental_models.createdAt.toISOString(),
          updatedAt: row.mental_models.updatedAt.toISOString(),
          book: bookWithoutCreatedAt,
        };
      });
    } catch (error) {
      if (error instanceof MentalModelNotFoundError || error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get mental models",
      );
    }
  }

  static async getById(params: MentalModelModel.GetByIdRequestParams) {
    try {
      const { id, userId } = params;

      const db = getDb();

      const results = await db
        .select()
        .from(mentalModels)
        .innerJoin(books, eq(mentalModels.bookId, books.id))
        .where(and(eq(mentalModels.id, id), eq(mentalModels.userId, userId)))
        .limit(1);

      if (results.length === 0) {
        throw new MentalModelNotFoundError(id);
      }

      const row = results[0];

      if (!row) {
        throw new MentalModelNotFoundError(id);
      }

      const { createdAt: _, ...bookWithoutCreatedAt } = row.books;
      return {
        ...row.mental_models,
        createdAt: row.mental_models.createdAt.toISOString(),
        updatedAt: row.mental_models.updatedAt.toISOString(),
        book: bookWithoutCreatedAt,
      };
    } catch (error) {
      if (error instanceof MentalModelNotFoundError || error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get mental model",
      );
    }
  }

  static async create(params: MentalModelModel.CreateRequestParams) {
    try {
      const { userId, data } = params;
      const db = getDb();

      const bookExists = await db.select().from(books).where(eq(books.id, data.bookId)).limit(1);

      if (bookExists.length === 0) {
        throw new BookNotFoundError(data.bookId);
      }

      const insertedMentalModels = await db
        .insert(mentalModels)
        .values({
          userId,
          ...data,
        })
        .returning({ id: mentalModels.id });

      if (!insertedMentalModels[0]) {
        throw new MentalModelNotFoundError(data.bookId);
      }

      return this.getById({ id: insertedMentalModels[0].id, userId });
    } catch (error) {
      if (error instanceof MentalModelNotFoundError || error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create mental model",
      );
    }
  }

  static async update(params: MentalModelModel.UpdateRequestParams) {
    try {
      const { id, userId, data } = params;

      const db = getDb();

      await this.getById({ id, userId });

      await db
        .update(mentalModels)
        .set({
          ...data,
        })
        .where(and(eq(mentalModels.id, id), eq(mentalModels.userId, userId)));

      return this.getById({ id, userId });
    } catch (error) {
      if (error instanceof MentalModelNotFoundError || error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to update mental model",
      );
    }
  }

  static async delete(params: MentalModelModel.DeleteRequestParams) {
    try {
      const { id, userId } = params;

      const db = getDb();

      await this.getById({ id, userId });

      await db
        .delete(mentalModels)
        .where(and(eq(mentalModels.id, id), eq(mentalModels.userId, userId)));

      return { success: true };
    } catch (error) {
      if (error instanceof MentalModelNotFoundError || error instanceof BookNotFoundError) {
        throw error;
      }

      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete mental model",
      );
    }
  }
}
