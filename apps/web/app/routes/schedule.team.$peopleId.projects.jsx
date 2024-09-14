import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import { transformProjects } from "../utils/transformers.js";
import { db } from "../utils/db.js";
import { projectsPeople } from "../schema.js";

export const loader = async ({ request, params }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const { peopleId } = params;
  const projects = await db.query.projects.findMany({
    where: (projects, { eq, inArray }) =>
      inArray(
        projects.id,
        db
          .select({ projectId: projectsPeople.projectId })
          .from(projectsPeople)
          .where(eq(projectsPeople.peopleId, peopleId))
      ),
    with: {
      people: {
        where: (projectsPeople, { eq }) =>
          eq(projectsPeople.peopleId, peopleId),
        with: { assignments: true },
      },
    },
  });
  return json(transformProjects(projects, startsOn, endsOn));
};
