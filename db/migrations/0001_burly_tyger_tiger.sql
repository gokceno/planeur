CREATE TABLE `projects_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`starts_on` text,
	`ends_on` text,
	`capacity` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
