import { createId } from "@paralleldrive/cuid2";
import { sql, relations } from "drizzle-orm";
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
  projectsPeopleId: text("projects_people_id").references(
    () => projectsPeople.id
  ),
  startsOn: text("starts_on").notNull(),
  endsOn: text("ends_on").notNull(),
  capacity: integer("capacity", { mode: "number" }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const people = sqliteTable("people", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  email: text("email").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  capacity: integer("capacity", { mode: "number" }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projectsPeople = sqliteTable("projects_people", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  projectId: text("project_id").references(() => projects.id),
  peopleId: text("people_id").references(() => people.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const projectsPeopleRelations = relations(
  projectsPeople,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [projectsPeople.projectId],
      references: [projects.id],
    }),
    person: one(people, {
      fields: [projectsPeople.peopleId],
      references: [people.id],
    }),
    assignments: many(projectsAssignments),
  })
);

export const peopleRelations = relations(people, ({ many }) => ({
  projects: many(projectsPeople),
}));

export const projectRelations = relations(projects, ({ many }) => ({
  people: many(projectsPeople),
}));

export const projectsAssignmentsRelations = relations(
  projectsAssignments,
  ({ one }) => ({
    projectsPeople: one(projectsPeople, {
      fields: [projectsAssignments.projectsPeopleId],
      references: [projectsPeople.id],
    }),
  })
);
