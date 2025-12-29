import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
    profilePictureUrl: text("profile_picture_url"),
    organizationId: text("organization_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("index_users_on_email").on(table.email),
    index("index_users_on_first_name").on(table.firstName),
    index("index_users_on_last_name").on(table.lastName),
    index("index_users_on_email_verified").on(table.emailVerified),
    index("index_users_on_organization_id").on(table.organizationId),
  ],
);

export const books = sqliteTable(
  "books",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    googleBookId: text("google_book_id").notNull().unique(),
    title: text("title").notNull(),
    authors: text("authors"),
    thumbnailUrl: text("thumbnail_url"),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("index_books_on_google_book_id").on(table.googleBookId),
    index("index_books_on_title").on(table.title),
    index("index_books_on_authors").on(table.authors),
  ],
);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

export const mentalModels = sqliteTable(
  "mental_models",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["reading", "completed"] })
      .notNull()
      .default("reading"),
    // Q1: なぜこの本を読もうと思ったか？
    whyReadAnswer1: text("why_read_answer_1").notNull(),
    whyReadAnswer2: text("why_read_answer_2").notNull(),
    whyReadAnswer3: text("why_read_answer_3").notNull(),
    // Q2: この本から何が得られそうか？
    whatToGainAnswer1: text("what_to_gain_answer_1").notNull(),
    whatToGainAnswer2: text("what_to_gain_answer_2").notNull(),
    whatToGainAnswer3: text("what_to_gain_answer_3").notNull(),
    // Q3: この本を読んだ後どうなっていたいか？
    goalAfterReadingAnswer1: text("goal_after_reading_answer_1").notNull(),
    goalAfterReadingAnswer2: text("goal_after_reading_answer_2").notNull(),
    goalAfterReadingAnswer3: text("goal_after_reading_answer_3").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("index_mental_models_on_status").on(table.status)],
);

export const userRelations = relations(users, ({ many }) => ({
  mentalModels: many(mentalModels),
}));

export const bookRelations = relations(books, ({ many }) => ({
  mentalModels: many(mentalModels),
}));

export const mentalModelRelations = relations(mentalModels, ({ one }) => ({
  user: one(users, { fields: [mentalModels.userId], references: [users.id] }),
  book: one(books, { fields: [mentalModels.bookId], references: [books.id] }),
}));
