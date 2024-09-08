import { createClient } from "@libsql/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { DateTime, Interval } from "luxon";
import CapacityBar from "../components/capacity-bar.jsx";
import DateHeader from "../components/date-header.jsx";
import * as schema from "../schema.js";

const transformProjects = (inputArray) => {
  const groupedByProject = inputArray.reduce((acc, item) => {
    const projectName = item.projects.projectName;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(item.projects_assignments);
    return acc;
  }, {});
  return Object.entries(groupedByProject).map(([projectName, assignments]) => {
    const capacityMap = new Map();
    assignments.forEach((assignment) => {
      const start = DateTime.fromISO(assignment.startsOn);
      const end = DateTime.fromISO(assignment.endsOn);
      let current = start;
      while (current <= end) {
        const dateKey = current.toISODate();
        capacityMap.set(
          dateKey,
          (capacityMap.get(dateKey) || 0) + assignment.capacity
        );
        current = current.plus({ days: 1 });
      }
    });
    const capacities = [];
    let currentRange = null;
    Array.from(capacityMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, capacity]) => {
        if (!currentRange || currentRange.capacity !== capacity) {
          if (currentRange) {
            capacities.push(currentRange);
          }
          currentRange = { startsOn: date, endsOn: date, capacity };
        } else {
          currentRange.endsOn = date;
        }
      });
    if (currentRange) {
      capacities.push(currentRange);
    }
    return { projectName, capacities };
  });
};

export const loader = async ({ request }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek ? DateTime.fromISO(selectedWeek) : DateTime.local();
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");

  // Set up DB
  const libsqlClient = createClient({
    url: "file:../../db/db.sqlite",
  });
  const db = drizzle(libsqlClient, { schema });
  const rows = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, "1"))
    .leftJoin(
      schema.projectsAssignments,
      eq(schema.projects.id, schema.projectsAssignments.projectId)
    );

  return json({ projects: transformProjects(rows), startsOn, endsOn });
};

const Projects = () => {
  const { projects, startsOn, endsOn } = useLoaderData();
  return (
    <div className="p-4">
      <DateHeader startsOn={startsOn} endsOn={endsOn} />
      <div className="space-y-2">
        {projects.map(({ projectName, capacities }, i) => (
          <div key={i}>
            <div className="flex items-center cursor-pointer">
              <div className="w-1/4 pr-4">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  <div className="font-semibold">{projectName}</div>
                </div>
              </div>
              <CapacityBar
                title={projectName}
                startsOn={startsOn}
                endsOn={endsOn}
                capacities={capacities}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
