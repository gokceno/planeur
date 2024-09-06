import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DateHeader from "../components/date-header.jsx";
import CapacityBar from "../components/capacity-bar.jsx";
import { DateTime, Interval } from "luxon";

export const loader = () => {
  const startsOn = "2024-08-31";
  const endsOn = "2024-09-07";
  const projects = [
    {
      projectName: "VillaSepeti Web",
      capacities: [
        {
          startsOn: "2024-08-31",
          endsOn: "2024-09-01",
          capacity: 2,
        },
        {
          startsOn: "2024-09-03",
          endsOn: "2024-09-05",
          capacity: 4,
        },
      ],
    },
    {
      projectName: "VillaSepeti Backoffice",
      capacities: [
        {
          startsOn: "2024-08-31",
          endsOn: "2024-09-02",
          capacity: 5,
        },
        {
          startsOn: "2024-09-05",
          endsOn: "2024-09-06",
          capacity: 0.5,
        },
      ],
    },
  ];
  return json({ projects, startsOn, endsOn });
};

function transformProjectCapacities(projects) {
  return projects.map((project) => ({
    ...project,
    capacities: transformCapacities(project.capacities),
  }));
}

function transformCapacities(capacities) {
  if (!capacities || capacities.length < 2) {
    return capacities; // Return original capacities if there's not enough entries
  }

  const transformedCapacities = [];
  const sortedCapacities = capacities.sort((a, b) =>
    DateTime.fromISO(a.startsOn) < DateTime.fromISO(b.startsOn) ? -1 : 1
  );

  for (let i = 0; i < sortedCapacities.length; i++) {
    const current = sortedCapacities[i];
    transformedCapacities.push(current);

    if (i < sortedCapacities.length - 1) {
      const next = sortedCapacities[i + 1];
      const currentEndDate = DateTime.fromISO(current.endsOn);
      const nextStartDate = DateTime.fromISO(next.startsOn);

      // Check if there's a gap
      if (currentEndDate.plus({ days: 1 }) < nextStartDate) {
        const gapInterval = Interval.fromDateTimes(
          currentEndDate.plus({ days: 1 }),
          nextStartDate.minus({ days: 1 })
        );

        transformedCapacities.push({
          startsOn: gapInterval.start.toISODate(),
          endsOn: gapInterval.end.toISODate(),
          capacity: 0,
          isGap: true,
        });
      }
    }
  }

  return transformedCapacities;
}

const Projects = () => {
  const { projects, startsOn, endsOn } = useLoaderData();
  return (
    <div className="p-4">
      <DateHeader startsOn={startsOn} endsOn={endsOn} />
      <div className="space-y-2">
        {transformProjectCapacities(projects).map(
          ({ projectName, projectId, capacities }, i) => (
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
          )
        )}
      </div>
    </div>
  );
};

export default Projects;
