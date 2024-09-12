import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import { transformPeopleWithAssignments } from "../utils/transformers.js";
import { db } from "../utils/db.js";

export const loader = async ({ request }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const people = await db.query.people.findMany({
    with: {
      assignments: true,
    },
  });
  return json(transformPeopleWithAssignments(people, startsOn, endsOn));
};
