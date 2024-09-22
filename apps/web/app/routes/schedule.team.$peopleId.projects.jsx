import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import {
  findAvailableProjectsByPeopleId,
  findAssignedProjectsByPeopleId,
} from "../utils/queries.js";
import { transformPeopleWithAssignments } from "../utils/transformers.js";

export const loader = async ({ request, params }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const { peopleId } = params;

  const assignedProjects = await findAssignedProjectsByPeopleId({ peopleId });
  const availableProjects = await findAvailableProjectsByPeopleId({ peopleId });

  return json({
    projects: transformPeopleWithAssignments(
      assignedProjects,
      startsOn,
      endsOn
    ),
    availableProjects,
  });
};
