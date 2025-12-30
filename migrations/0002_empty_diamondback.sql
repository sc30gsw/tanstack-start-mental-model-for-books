CREATE TABLE `action_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`mental_model_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`mental_model_id`) REFERENCES `mental_models`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `index_action_plans_on_mental_model_id` ON `action_plans` (`mental_model_id`);--> statement-breakpoint
CREATE TABLE `likes` (
	`mental_model_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`mental_model_id`) REFERENCES `mental_models`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `index_likes_on_mental_model_id` ON `likes` (`mental_model_id`);--> statement-breakpoint
CREATE INDEX `index_likes_on_user_id` ON `likes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likes_mental_model_id_user_id_unique` ON `likes` (`mental_model_id`,`user_id`);