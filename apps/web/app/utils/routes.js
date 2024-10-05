import { json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { projectsAssignments } from "../schema.js";
import { db } from "../utils/db.js";
import abilityFor from "../utils/abilities.js";
import { authenticator } from "../utils/auth.server";

export const assignments = () => {
  return {
    async action({ request, params }) {
      let user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
      });
      if (abilityFor(user).can("edit", "ProjectsAssignments")) {
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
      } else {
        throw new Response("Forbidden", { status: 403 });
      }
    },
    async loader({ request, params }) {
      let user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
      });
      if (abilityFor(user).can("edit", "ProjectsAssignments")) {
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
      } else {
        throw new Response("Forbidden", { status: 403 });
      }
    },
  };
};
