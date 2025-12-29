CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`google_book_id` text NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`thumbnail_url` text,
	`description` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_google_book_id_unique` ON `books` (`google_book_id`);--> statement-breakpoint
CREATE INDEX `index_books_on_google_book_id` ON `books` (`google_book_id`);--> statement-breakpoint
CREATE INDEX `index_books_on_title` ON `books` (`title`);--> statement-breakpoint
CREATE INDEX `index_books_on_authors` ON `books` (`authors`);--> statement-breakpoint
CREATE TABLE `mental_models` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`book_id` text NOT NULL,
	`status` text DEFAULT 'reading' NOT NULL,
	`why_read_answer_1` text NOT NULL,
	`why_read_answer_2` text NOT NULL,
	`why_read_answer_3` text NOT NULL,
	`what_to_gain_answer_1` text NOT NULL,
	`what_to_gain_answer_2` text NOT NULL,
	`what_to_gain_answer_3` text NOT NULL,
	`goal_after_reading_answer_1` text NOT NULL,
	`goal_after_reading_answer_2` text NOT NULL,
	`goal_after_reading_answer_3` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `index_mental_models_on_status` ON `mental_models` (`status`);--> statement-breakpoint
CREATE INDEX `index_users_on_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `index_users_on_first_name` ON `users` (`first_name`);--> statement-breakpoint
CREATE INDEX `index_users_on_last_name` ON `users` (`last_name`);--> statement-breakpoint
CREATE INDEX `index_users_on_email_verified` ON `users` (`email_verified`);--> statement-breakpoint
CREATE INDEX `index_users_on_organization_id` ON `users` (`organization_id`);