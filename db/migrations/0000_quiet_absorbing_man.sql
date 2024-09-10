CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`firstname` text NOT NULL,
	`lastname` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`project_name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`people_id` text,
	`starts_on` text NOT NULL,
	`ends_on` text NOT NULL,
	`capacity` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`people_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action
);
