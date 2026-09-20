CREATE TABLE `attempts` (
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`item_id` text NOT NULL,
	`kind` text NOT NULL,
	`correct` integer,
	`assisted` integer NOT NULL,
	`rating` integer,
	`answer` text,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `event_id`)
);
--> statement-breakpoint
CREATE TABLE `join_limits` (
	`user_id` text NOT NULL,
	`bucket` integer NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`user_id`, `bucket`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`user_id` text PRIMARY KEY NOT NULL,
	`joined_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`user_id` text NOT NULL,
	`book` text NOT NULL,
	`payload` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `book`)
);
