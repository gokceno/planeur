import { db } from "../utils/db.js";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { DateTime } from "luxon";
// import { useState, useEffect } from "react";
import CapacityBar from "../components/capacity-bar.jsx";
import DateHeader from "../components/date-header.jsx";
import { transformPeopleWithAssignments } from "../utils/transformers.js";

export const loader = async ({ request }) => {
  const selectedWeek = new URL(request.url)?.searchParams?.get("w");
  const now = selectedWeek ? DateTime.fromISO(selectedWeek) : DateTime.local();
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
    people: transformPeopleWithAssignments(people, startsOn, endsOn),
    startsOn,
    endsOn,
  });
};

const People = () => {
  const { people, startsOn, endsOn } = useLoaderData();
  // const [expandedTeamMembers, setExpandedTeamMembers] = useState({});
  const fetcher = useFetcher();

  const [searchParams] = useSearchParams();

  const selectedWeek = searchParams.get("w") ?? DateTime.local().toISODate();

  // useEffect(() => {
  //   Object.keys(expandedTeamMembers).forEach((id) => {
  //     if (expandedTeamMembers[id]) {
  //       fetcher.load(`/schedule/projects/${id}/team/?w=${selectedWeek}`);
  //     }
  //   });
  // }, [selectedWeek]);

  const toggleTeamMember = (id) => {
    setExpandedTeamMembers((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!expandedTeamMembers[id]) {
      fetcher.load(`/schedule/projects/${id}/team/?w=${selectedWeek}`);
    }
  };

  return (
    <div className="p-4">
      <DateHeader startsOn={startsOn} endsOn={endsOn} />
      <div className="space-y-2">
        {people.map(({ firstname, lastname, capacities }, i) => (
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
                    {firstname} {lastname}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
