import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import CapacityBar from "../components/capacity-bar.jsx";
import DateHeader from "../components/date-header.jsx";
import { projectsPeople } from "../schema.js";
import abilityFor from "../utils/abilities.js";
import { authenticator } from "../utils/auth.server";
import { db } from "../utils/db.js";
import {
  findAssignedProjectsByPeopleId,
  findAvailableProjectsByPeopleId,
} from "../utils/queries.js";
import {
  transformPeopleWithAssignments,
  transformProjectsViaPeopleWithAssignments,
} from "../utils/transformers.js";

export const loader = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (abilityFor(user).can("view", "Projects")) {
    const selectedWeek = new URL(request.url)?.searchParams?.get("w");
    const now = selectedWeek
      ? DateTime.fromISO(selectedWeek)
      : DateTime.local();
    const startsOn = now.startOf("week");
    const endsOn = now.endOf("week");
    const people = await db.query.people.findMany({
      with: {
        projects: {
          with: { assignments: true },
        },
      },
    });
    return json({
      people: transformProjectsViaPeopleWithAssignments(
        people,
        startsOn,
        endsOn,
      ),
      startsOn,
      endsOn,
      canEditProjects: abilityFor(user).can("edit", "Projects"),
      canEditProjectsAssignments: abilityFor(user).can(
        "edit",
        "ProjectsAssignments",
      ),
    });
  } else {
    throw new Response("Forbidden", { status: 403 });
  }
};

export const action = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (abilityFor(user).can("edit", "Projects")) {
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
    const assignedProjects = await findAssignedProjectsByPeopleId({ peopleId });
    const availableProjects = await findAvailableProjectsByPeopleId({
      peopleId,
    });
    return json({
      projects: transformPeopleWithAssignments(
        assignedProjects,
        startsOn,
        endsOn,
      ),
      availableProjects,
    });
  } else {
    throw new Response("Forbidden", { status: 403 });
  }
};

const People = () => {
  const {
    people,
    startsOn,
    endsOn,
    canEditProjects,
    canEditProjectsAssignments,
  } = useLoaderData();
  const [expandedTeamMembers, setExpandedTeamMembers] = useState({});
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const selectedWeek = searchParams.get("w") ?? DateTime.local().toISODate();

  useEffect(() => {
    Object.keys(expandedTeamMembers).forEach((id) => {
      if (expandedTeamMembers[id]) {
        fetcher.load(`/schedule/team/${id}/projects/?w=${selectedWeek}`);
      }
    });
  }, [selectedWeek]);

  const toggleTeamMember = (id) => {
    setExpandedTeamMembers((prev) => ({ [id]: !prev[id] }));
    if (!expandedTeamMembers[id]) {
      fetcher.load(`/schedule/team/${id}/projects/?w=${selectedWeek}`);
    }
  };

  return (
    <div className="p-4">
      <DateHeader startsOn={startsOn} endsOn={endsOn} />
      <div className="space-y-2">
        {people.map(
          ({ id, firstname, lastname, capacities, periodicCapacity }, i) => (
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
                    <div className="font-semibold">
                      {firstname} {lastname} &bull;{" "}
                      {periodicCapacity.toFixed(1)} hrs
                    </div>
                  </div>
                </button>
                <CapacityBar
                  title={`${firstname} ${lastname}`}
                  startsOn={startsOn}
                  endsOn={endsOn}
                  capacities={capacities}
                  style="large"
                />
              </div>
              {expandedTeamMembers[id] === true && (
                <div className="mt-2 space-y-2">
                  {fetcher.data &&
                    fetcher.data.projects &&
                    fetcher.data.projects.map(
                      ({ project, capacities, id, periodicCapacity }, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-1/4 pr-4 flex items-center">
                            <div className="text-sm ml-6">
                              {canEditProjectsAssignments && (
                                <Link
                                  to={`/schedule/team/assignments/${id}?w=${selectedWeek}`}
                                >
                                  {project.projectName} &bull;{" "}
                                  {periodicCapacity.toFixed(1)} hrs
                                </Link>
                              )}
                              {!canEditProjectsAssignments && (
                                <span>
                                  {project.projectName} &bull;{" "}
                                  {periodicCapacity.toFixed(1)} hrs
                                </span>
                              )}
                            </div>
                          </div>
                          <CapacityBar
                            title={`${project.projectName}`}
                            startsOn={startsOn}
                            endsOn={endsOn}
                            capacities={capacities}
                            style="small"
                          />
                        </div>
                      ),
                    )}
                  {canEditProjects &&
                    fetcher.data &&
                    !!fetcher.data.availableProjects?.length && (
                      <div className="flex items-center mt-2">
                        <div className="w-1/4 pr-4">
                          <fetcher.Form method="post">
                            <select
                              name="projectId"
                              className="w-3/4 p-2 border rounded text-sm ml-6"
                              onChange={(e) => {
                                if (e.target.value) {
                                  e.target.form.requestSubmit();
                                }
                              }}
                            >
                              <option>Add project to user...</option>
                              {fetcher.data &&
                                fetcher.data.availableProjects.map(
                                  (project, i) => (
                                    <option key={i} value={project.id}>
                                      {project.projectName}
                                    </option>
                                  ),
                                )}
                            </select>
                            <input type="hidden" name="peopleId" value={id} />
                          </fetcher.Form>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default People;
