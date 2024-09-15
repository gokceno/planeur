import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import { transformPeopleWithAssignments } from "../utils/transformers.js";
import {
  findAssignedPeopleByProjectId,
  findAvailablePeopleByProjectId,
} from "../utils/queries.js";

export const loader = async ({ request, params }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const { projectId } = params;

  const assignedPeople = await findAssignedPeopleByProjectId({ projectId });
  const availablePeople = await findAvailablePeopleByProjectId({ projectId });

  return json({
    people: transformPeopleWithAssignments(assignedPeople, startsOn, endsOn),
    availablePeople,
  });
};
