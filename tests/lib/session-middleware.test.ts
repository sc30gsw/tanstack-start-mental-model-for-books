import { test, expect, beforeEach, afterEach, mock, describe } from "bun:test";
import { Elysia } from "elysia";
import { DatabaseError } from "~/db";
import { ERROR_STATUS } from "~/constants/error-message";

type MockDb = {
  query: {
    users: {
      findFirst: (options: { where: (users: any, ops: { eq: any }) => any }) => Promise<any>;
    };
  };
};

let mockGetDb: ReturnType<typeof mock<() => MockDb>>;
let mockDb: MockDb;

beforeEach(() => {
  mockDb = {
    query: {
      users: {
        findFirst: mock(() => Promise.resolve(null)),
      },
    },
  };

  mockGetDb = mock(() => mockDb);

  mock.module("~/db", () => ({
    getDb: mockGetDb,
    DatabaseError,
  }));
});

afterEach(() => {
  mock.restore();
});

describe("sessionMiddleware", () => {
  describe("derive - 認証処理", () => {
    test("authorization ヘッダーがない場合、UnauthorizedError をスローする", async () => {
      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {},
        }),
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        error: ERROR_STATUS.UNAUTHORIZED,
        code: "UNAUTHORIZED",
      });
    });

    test("authorization ヘッダーが空文字列の場合、UnauthorizedError をスローする", async () => {
      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {
            authorization: "",
          },
        }),
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        error: ERROR_STATUS.UNAUTHORIZED,
        code: "UNAUTHORIZED",
      });
    });

    test("ユーザーが見つからない場合、UserNotFoundError をスローする", async () => {
      mockDb.query.users.findFirst = mock(() => Promise.resolve(null));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {
            authorization: "user-123",
          },
        }),
      );

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        error: ERROR_STATUS.USER_NOT_FOUND,
        code: "USER_NOT_FOUND",
      });
      expect(mockGetDb).toHaveBeenCalled();
      expect(mockDb.query.users.findFirst).toHaveBeenCalled();
    });

    test("ユーザーが見つかった場合、user オブジェクトを返す", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        profilePictureUrl: null,
        organizationId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      mockDb.query.users.findFirst = mock(() => Promise.resolve(mockUser));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", ({ user }) => {
        return { user };
      });

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {
            authorization: "user-123",
          },
        }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        emailVerified: mockUser.emailVerified,
        profilePictureUrl: mockUser.profilePictureUrl,
        organizationId: mockUser.organizationId,
      });
      expect(new Date(body.user.createdAt).getTime()).toBe(mockUser.createdAt.getTime());
      expect(new Date(body.user.updatedAt).getTime()).toBe(mockUser.updatedAt.getTime());
      expect(mockGetDb).toHaveBeenCalled();
      expect(mockDb.query.users.findFirst).toHaveBeenCalled();
    });

    test("データベースエラーが発生した場合、DatabaseError をスローする", async () => {
      const dbError = new Error("Connection failed");
      mockDb.query.users.findFirst = mock(() => Promise.reject(dbError));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      await expect(
        app.handle(
          new Request("http://localhost/", {
            headers: {
              authorization: "user-123",
            },
          }),
        ),
      ).rejects.toThrow(DatabaseError);
    });

    test("データベースエラーのメッセージが正しく伝播される", async () => {
      const errorMessage = "Database connection timeout";
      const dbError = new Error(errorMessage);
      mockDb.query.users.findFirst = mock(() => Promise.reject(dbError));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      try {
        await app.handle(
          new Request("http://localhost/", {
            headers: {
              authorization: "user-123",
            },
          }),
        );

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toBe(errorMessage);
      }
    });

    test("エラーオブジェクトでない場合でも、適切なエラーメッセージを返す", async () => {
      mockDb.query.users.findFirst = mock(() => Promise.reject("String error"));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      try {
        await app.handle(
          new Request("http://localhost/", {
            headers: {
              authorization: "user-123",
            },
          }),
        );

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toBe("Failed to get user");
      }
    });
  });

  describe("onError - エラーハンドリング", () => {
    test("UnauthorizedError が正しく処理される", async () => {
      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {},
        }),
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        error: ERROR_STATUS.UNAUTHORIZED,
        code: "UNAUTHORIZED",
      });
    });

    test("UserNotFoundError が正しく処理される", async () => {
      mockDb.query.users.findFirst = mock(() => Promise.resolve(null));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", () => "ok");

      const response = await app.handle(
        new Request("http://localhost/", {
          headers: {
            authorization: "non-existent-user",
          },
        }),
      );

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        error: ERROR_STATUS.USER_NOT_FOUND,
        code: "USER_NOT_FOUND",
      });
    });

    test("未知のエラーは再スローされる", async () => {
      const unknownError = new Error("Unknown error");
      mockDb.query.users.findFirst = mock(() => Promise.reject(unknownError));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia()
        .use(sessionMiddleware)
        .get("/", () => "ok")
        .onError(({ error }) => {
          throw error;
        });

      await expect(
        app.handle(
          new Request("http://localhost/", {
            headers: {
              authorization: "user-123",
            },
          }),
        ),
      ).rejects.toThrow("Unknown error");
    });
  });

  describe("統合テスト - 実際の使用シナリオ", () => {
    test("認証されたユーザーがルートハンドラーで user にアクセスできる", async () => {
      const mockUser = {
        id: "user-456",
        email: "authenticated@example.com",
        firstName: "Authenticated",
        lastName: "User",
        emailVerified: true,
        profilePictureUrl: "https://example.com/avatar.jpg",
        organizationId: "org-123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      mockDb.query.users.findFirst = mock(() => Promise.resolve(mockUser));

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/profile", ({ user }) => {
        return {
          userId: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      });

      const response = await app.handle(
        new Request("http://localhost/profile", {
          headers: {
            authorization: "user-456",
          },
        }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        userId: "user-456",
        email: "authenticated@example.com",
        name: "Authenticated User",
      });
    });

    test("複数のリクエストで getDb が正しく呼び出される", async () => {
      const mockUser1 = {
        id: "user-1",
        email: "user1@example.com",
        firstName: "User",
        lastName: "One",
        emailVerified: false,
        profilePictureUrl: null,
        organizationId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      const mockUser2 = {
        id: "user-2",
        email: "user2@example.com",
        firstName: "User",
        lastName: "Two",
        emailVerified: true,
        profilePictureUrl: null,
        organizationId: null,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      };

      const { sessionMiddleware } = await import("~/lib/session-middleware");
      const app = new Elysia().use(sessionMiddleware).get("/", ({ user }) => ({ userId: user.id }));

      mockDb.query.users.findFirst = mock(() => Promise.resolve(mockUser1));
      const response1 = await app.handle(
        new Request("http://localhost/", {
          headers: { authorization: "user-1" },
        }),
      );
      expect(response1.status).toBe(200);
      expect(await response1.json()).toEqual({ userId: "user-1" });

      mockDb.query.users.findFirst = mock(() => Promise.resolve(mockUser2));
      const response2 = await app.handle(
        new Request("http://localhost/", {
          headers: { authorization: "user-2" },
        }),
      );
      expect(response2.status).toBe(200);
      expect(await response2.json()).toEqual({ userId: "user-2" });

      expect(mockGetDb).toHaveBeenCalledTimes(2);
    });
  });
});
