import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import { transformPeopleWithAssignments } from "../utils/transformers.js";
import { db } from "../utils/db.js";
import { projectsPeople } from "../schema.js";

export const loader = async ({ request, params }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const { projectId } = params;
  const people = await db.query.people.findMany({
    where: (people, { eq, inArray }) =>
      inArray(
        people.id,
        db
          .select({ peopleId: projectsPeople.peopleId })
          .from(projectsPeople)
          .where(eq(projectsPeople.projectId, projectId))
      ),
    with: {
      projects: {
        where: (projectsPeople, { eq }) =>
          eq(projectsPeople.projectId, projectId),
        with: { assignments: true },
      },
    },
  });
  return json(transformPeopleWithAssignments(people, startsOn, endsOn));
};
