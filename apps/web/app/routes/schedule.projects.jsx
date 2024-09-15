import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import CapacityBar from "../components/capacity-bar.jsx";
import DateHeader from "../components/date-header.jsx";
import { projectsPeople } from "../schema.js";
import { db } from "../utils/db.js";
import {
  findAssignedPeopleByProjectId,
  findAvailablePeopleByProjectId,
} from "../utils/queries.js";
import {
  transformProjects,
  transformPeopleWithAssignments,
} from "../utils/transformers.js";

export const loader = async ({ request }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek ? DateTime.fromISO(selectedWeek) : DateTime.local();
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");

  const projects = await db.query.projects.findMany({
    with: {
      people: {
        with: { assignments: true },
      },
    },
  });

  return json({
    projects: transformProjects(projects, startsOn, endsOn),
    startsOn,
    endsOn,
  });
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek
    ? DateTime.fromISO(selectedWeek)
    : DateTime.local({ zone: "Europe/Istanbul" });
  const startsOn = now.startOf("week");
  const endsOn = now.endOf("week");
  const projectId = form.get("projectId");
  const peopleId = form.get("peopleId");

  await db.insert(projectsPeople).values({ projectId, peopleId });

  const assignedPeople = await findAssignedPeopleByProjectId({ projectId });
  const availablePeople = await findAvailablePeopleByProjectId({
    projectId,
  });

  return json({
    people: transformPeopleWithAssignments(assignedPeople, startsOn, endsOn),
    availablePeople,
  });
};

const Projects = () => {
  const { projects, startsOn, endsOn } = useLoaderData();
  const [expandedTeamMembers, setExpandedTeamMembers] = useState({});
  const fetcher = useFetcher();

  const [searchParams] = useSearchParams();

  const selectedWeek = searchParams.get("w") ?? DateTime.local().toISODate();

  useEffect(() => {
    Object.keys(expandedTeamMembers).forEach((id) => {
      if (expandedTeamMembers[id]) {
        fetcher.load(`/schedule/projects/${id}/team/?w=${selectedWeek}`);
      }
    });
  }, [selectedWeek]);

  const toggleTeamMember = (id) => {
    setExpandedTeamMembers((prev) => ({ [id]: !prev[id] }));
    if (!expandedTeamMembers[id]) {
      fetcher.load(`/schedule/projects/${id}/team/?w=${selectedWeek}`);
    }
  };

  return (
    <div className="p-4">
      <DateHeader startsOn={startsOn} endsOn={endsOn} />
      <div className="space-y-2">
        {projects.map(({ projectName, capacities, id }, i) => (
          <div key={i}>
            <div className="flex items-center">
              <button
                className="w-1/4 pr-4 cursor-pointer"
                onClick={() => toggleTeamMember(id)}
              >
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
              </button>
              <CapacityBar
                title={projectName}
                startsOn={startsOn}
                endsOn={endsOn}
                capacities={capacities}
                style="large"
              />
            </div>
            {expandedTeamMembers[id] === true && (
              <div className="mt-2 space-y-2">
                {fetcher.data &&
                  fetcher.data.people.map(
                    ({ firstname, lastname, capacities }, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1/4 pr-4 flex items-center">
                          <div className="text-sm ml-6">
                            {firstname} {lastname}
                          </div>
                        </div>
                        <CapacityBar
                          title={`${firstname} ${lastname}`}
                          startsOn={startsOn}
                          endsOn={endsOn}
                          capacities={capacities}
                          style="small"
                        />
                      </div>
                    )
                  )}
                {fetcher.data && !!fetcher.data.availablePeople?.length && (
                  <div className="flex items-center mt-2">
                    <div className="w-1/4 pr-4">
                      <fetcher.Form method="post">
                        <select
                          name="peopleId"
                          className="w-3/4 p-2 border rounded text-sm ml-6"
                          onChange={(e) => {
                            if (e.target.value) {
                              e.target.form.requestSubmit();
                            }
                          }}
                        >
                          <option>Add user to project...</option>
                          {fetcher.data &&
                            fetcher.data.availablePeople.map((people, i) => (
                              <option key={i} value={people.id}>
                                {people.firstname} {people.lastname}
                              </option>
                            ))}
                        </select>
                        <input type="hidden" name="projectId" value={id} />
                      </fetcher.Form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
