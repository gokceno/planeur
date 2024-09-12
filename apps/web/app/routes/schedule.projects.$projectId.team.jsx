import { createClient } from "@libsql/client";
import { json } from "@remix-run/node";
import { drizzle } from "drizzle-orm/libsql";
import { DateTime } from "luxon";
import * as schema from "../schema.js";
import { transformPeopleWithAssignments } from "../utils/transformers.js";
import People from "./schedule.team.jsx";

export const loader = async ({ request }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const libsqlClient = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
  });
  const db = drizzle(libsqlClient, { schema });
  const people = await db.query.people.findMany({
    with: {
      assignments: true,
    },
  });
  return json(transformPeopleWithAssignments(people, startsOn, endsOn));
};
