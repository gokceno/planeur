import { json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { projectsAssignments } from "../schema.js";
import { db } from "../utils/db.js";

export const assignments = () => {
  return {
    async action({ request, params }) {
      const form = await request.formData();
      const startsOn = form.getAll("startsOn");
      const endsOn = form.getAll("endsOn");
      const capacity = form.getAll("capacity");
      const { projectsPeopleId } = params;
      await db
        .delete(projectsAssignments)
        .where(eq(projectsAssignments.projectsPeopleId, projectsPeopleId));

      for (let i = 0; i < startsOn.length; i++) {
        await db.insert(projectsAssignments).values({
          projectsPeopleId,
          startsOn: startsOn[i],
          endsOn: endsOn[i],
          capacity: capacity[i],
        });
      }
      return json({ ok: true });
    },
    async loader({ params }) {
      const { projectsPeopleId } = params;
      const assignments = await db.query.projectsAssignments.findMany({
        where: (projectsAssignments, { eq }) =>
          eq(projectsAssignments.projectsPeopleId, projectsPeopleId),
        orderBy: (projectsAssignments, { asc }) => [
          asc(projectsAssignments.startsOn),
          asc(projectsAssignments.endsOn),
        ],
      });
      return json({
        assignments,
      });
    },
  };
};
