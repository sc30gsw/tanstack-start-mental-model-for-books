import { Elysia } from "elysia";
import { ERROR_STATUS } from "~/constants/error-message";
import { DatabaseError, getDb } from "~/db";

class UnauthorizedError extends Error {
  status = 401;

  constructor() {
    super(ERROR_STATUS.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

class UserNotFoundError extends Error {
  status = 404;

  constructor() {
    super(ERROR_STATUS.USER_NOT_FOUND);
    this.name = "UserNotFoundError";
  }
}

export const sessionMiddleware = new Elysia({ name: "session" })
  .error({
    UnauthorizedError,
    UserNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UnauthorizedError":
        set.status = error.status;
        return {
          error: error.message,
          code: "UNAUTHORIZED",
        };

      case "UserNotFoundError":
        set.status = error.status;
        return {
          error: error.message,
          code: "USER_NOT_FOUND",
        };

      default:
        throw error;
    }
  })
  .derive(async ({ headers }) => {
    const userId = headers.authorization;

    if (!userId) {
      throw new UnauthorizedError();
    }

    try {
      const db = getDb();

      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (!user) {
        throw new UserNotFoundError();
      }

      return { user };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }

      throw new DatabaseError(error instanceof Error ? error.message : "Failed to get user");
    }
  })
  .as("scoped");
