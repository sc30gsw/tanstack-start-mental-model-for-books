import { test, expect, describe } from "bun:test";
import { Type, type TObject } from "@sinclair/typebox";
import { spread, spreads } from "~/db/utils";
import { users, books } from "~/db/schema";
import type { Table } from "drizzle-orm";

describe("spread", () => {
  describe("TObject の処理", () => {
    test("TObject を mode なしで spread する", () => {
      const schema = Type.Object({
        name: Type.String(),
        age: Type.Number(),
      });

      const result = spread(schema as any) as Record<string, unknown>;

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("age");
      expect(result.name).toBeDefined();
      expect(result.age).toBeDefined();
    });

    test("TObject を mode: 'select' で spread する", () => {
      const schema = Type.Object({
        name: Type.String(),
        age: Type.Number(),
      });

      const result = spread(schema as any, "select");

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("age");
    });

    test("TObject を mode: 'insert' で spread する", () => {
      const schema = Type.Object({
        name: Type.String(),
        age: Type.Number(),
      });

      const result = spread(schema as any, "insert");

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("age");
    });
  });

  describe("Table の処理", () => {
    test("Table を mode なしで spread する（エラーがスローされる）", () => {
      expect(() => {
        spread(users);
      }).toThrow("Expect a schema");
    });

    test("Table を mode: 'select' で spread する", () => {
      const result = spread(users, "select");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    test("Table を mode: 'insert' で spread する", () => {
      const result = spread(users, "insert");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    test("books テーブルを mode: 'select' で spread する", () => {
      const result = spread(books, "select");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    test("books テーブルを mode: 'insert' で spread する", () => {
      const result = spread(books, "insert");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });

  describe("エラーハンドリング", () => {
    test("Kind がないオブジェクトを mode なしで spread するとエラーをスローする", () => {
      const invalidSchema = { name: "test" } as unknown as TObject;

      expect(() => {
        spread(invalidSchema);
      }).toThrow("Expect a schema");
    });

    test("Kind がないオブジェクトを mode: 'select' で spread すると createSelectSchema が呼ばれる", () => {
      const result = spread(users, "select");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    test("Kind がないオブジェクトを mode: 'insert' で spread すると createInsertSchema が呼ばれる", () => {
      const result = spread(users, "insert");

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("実際のスキーマでの動作確認", () => {
    test("users テーブルの select スキーマに期待されるフィールドが含まれる", () => {
      const result = spread(users, "select");

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("firstName");
      expect(result).toHaveProperty("lastName");
    });

    test("books テーブルの insert スキーマに期待されるフィールドが含まれる", () => {
      const result = spread(books, "insert");

      expect(result).toHaveProperty("googleBookId");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("authors");
    });
  });
});

describe("spreads", () => {
  describe("複数テーブルの処理", () => {
    test("複数のテーブルを mode なしで spread する（エラーがスローされる）", () => {
      expect(() => {
        spreads({ users, books });
      }).toThrow("Expect a schema");
    });

    test("複数のテーブルを mode: 'select' で spread する", () => {
      const result = spreads({ users, books }, "select");

      expect(result).toHaveProperty("users");
      expect(result).toHaveProperty("books");
      expect(typeof result.users).toBe("object");
      expect(typeof result.books).toBe("object");
      expect(Object.keys(result.users).length).toBeGreaterThan(0);
      expect(Object.keys(result.books).length).toBeGreaterThan(0);
    });

    test("複数のテーブルを mode: 'insert' で spread する", () => {
      const result = spreads({ users, books }, "insert");

      expect(result).toHaveProperty("users");
      expect(result).toHaveProperty("books");
      expect(typeof result.users).toBe("object");
      expect(typeof result.books).toBe("object");
      expect(Object.keys(result.users).length).toBeGreaterThan(0);
      expect(Object.keys(result.books).length).toBeGreaterThan(0);
    });
  });

  describe("TObject と Table の混合", () => {
    test("TObject と Table を mode: 'select' で spread する", () => {
      const customSchema = Type.Object({
        customField: Type.String(),
      });

      const result = spreads({ customSchema, users }, "select");

      expect(result).toHaveProperty("customSchema");
      expect(result).toHaveProperty("users");
      expect(typeof result.customSchema).toBe("object");
      expect(typeof result.users).toBe("object");
    });
  });

  describe("エッジケース", () => {
    test("空のオブジェクトを spread する", () => {
      const result = spreads({}, "select");

      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBe(0);
    });

    test("null のモデルをスキップする", () => {
      const result = spreads(
        {
          users,
          nullModel: null as unknown as Table,
        },
        "select",
      );

      expect(result).toHaveProperty("users");
      expect(result.nullModel).toBeUndefined();
    });

    test("単一のテーブルを spread する", () => {
      const result = spreads({ users }, "select");

      expect(result).toHaveProperty("users");
      expect(Object.keys(result).length).toBe(1);
    });
  });

  describe("実際のスキーマでの動作確認", () => {
    test("users と books の select スキーマが正しく生成される", () => {
      const result = spreads({ users, books }, "select");

      expect(result.users).toHaveProperty("id");
      expect(result.users).toHaveProperty("email");
      expect(result.books).toHaveProperty("id");
      expect(result.books).toHaveProperty("title");
    });

    test("users と books の insert スキーマが正しく生成される", () => {
      const result = spreads({ users, books }, "insert");

      expect(result.users).toHaveProperty("email");
      expect(result.books).toHaveProperty("googleBookId");
      expect(result.books).toHaveProperty("title");
    });
  });
});
