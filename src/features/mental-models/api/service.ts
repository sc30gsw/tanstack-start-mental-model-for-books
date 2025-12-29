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

      const results = await db.query.mentalModels.findMany({
        where: eq(mentalModels.userId, userId),
        orderBy: [mentalModels.createdAt],
        with: {
          book: true,
        },
      });

      return results.map((row) => {
        const { createdAt: _, ...bookWithoutCreatedAt } = row;

        return {
          ...row,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
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

      const results = await db.query.mentalModels.findFirst({
        where: and(eq(mentalModels.id, id), eq(mentalModels.userId, userId)),
        with: {
          book: true,
        },
      });

      if (!results) {
        throw new MentalModelNotFoundError(id);
      }

      const { createdAt: _, ...bookWithoutCreatedAt } = results.book;

      return {
        ...results,
        createdAt: results.createdAt.toISOString(),
        updatedAt: results.updatedAt.toISOString(),
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

      const bookExists = await db.query.books.findFirst({
        where: eq(books.id, data.bookId),
      });

      if (!bookExists) {
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
