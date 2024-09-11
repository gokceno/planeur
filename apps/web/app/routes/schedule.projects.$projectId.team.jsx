import { createClient } from "@libsql/client";
import { json } from "@remix-run/node";
import { drizzle } from "drizzle-orm/libsql";
import { DateTime } from "luxon";
import * as schema from "../schema.js";

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
  const assignments = await db.query.people.findMany({
    with: {
      assignments: {
        where: (assignments, { and, gte, lte }) =>
          and(
            gte(assignments.startsOn, startsOn.toISO().split("T")[0]),
            lte(assignments.endsOn, endsOn.toISO().split("T")[0])
          ),
      },
    },
  });

  console.log(startsOn, endsOn);

  return json(assignments);
};
