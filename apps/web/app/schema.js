import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  projectName: text("project_name"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projectsAssignments = sqliteTable("projects_assignments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  projectId: text("project_id").references(() => projects.id),
  startsOn: text("starts_on"),
  endsOn: text("ends_on"),
  capacity: integer("capacity", { mode: "number" }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
