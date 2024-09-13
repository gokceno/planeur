import { DateTime } from "luxon";

export const transformPeopleWithAssignments = (people, startsOn, endsOn) => {
  return people.map((person) => ({
    ...person,
    assignments: person.assignments.map((assignment) => ({
      ...assignment,
      startsOn:
        DateTime.fromISO(assignment.startsOn) < startsOn
          ? startsOn.toISODate()
          : assignment.startsOn,
      endsOn:
        DateTime.fromISO(assignment.endsOn) > endsOn
          ? endsOn.toISODate()
          : assignment.endsOn,
    })),
  }));
};

export const transformProjects = (inputArray, limitStart, limitEnd) => {
  // Group by project
  const groupedByProject = inputArray.reduce((acc, item) => {
    const projectName = item.projects.projectName;
    const projectId = item.projects.id;
    if (!acc[projectName]) {
      acc[projectName] = { id: projectId, assignments: [] };
    }
    acc[projectName].assignments.push(item.projects_assignments);
    return acc;
  }, {});
  // Transform each project
  return Object.entries(groupedByProject).map(
    ([projectName, { id, assignments }]) => {
      // Create a map of dates to capacities
      const capacityMap = new Map();
      assignments.forEach((assignment) => {
        const assignmentStart = DateTime.fromISO(assignment.startsOn);
        const assignmentEnd = DateTime.fromISO(assignment.endsOn);
        // Calculate the overlap with the limit range
        const start =
          assignmentStart < limitStart ? limitStart : assignmentStart;
        const end = assignmentEnd > limitEnd ? limitEnd : assignmentEnd;
        if (start <= end) {
          let current = start;
          while (current <= end) {
            const dateKey = current.toISODate();
            capacityMap.set(
              dateKey,
              (capacityMap.get(dateKey) || 0) + assignment.capacity
            );
            current = current.plus({ days: 1 });
          }
        }
      });
      // Convert the map to an array of date ranges with capacities
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
      return { projectName, id, capacities };
    }
  );
};

export const transformGaps = (capacities) => {
  if (!capacities || capacities.length === 0) {
    return capacities;
  }
  const transformedCapacities = [];
  const sortedCapacities = capacities.sort((a, b) =>
    DateTime.fromISO(a.startsOn) < DateTime.fromISO(b.startsOn) ? -1 : 1
  );
  // Find the Monday of the week containing the first capacity
  const firstCapacityDate = DateTime.fromISO(sortedCapacities[0].startsOn);
  const weekStart = firstCapacityDate.startOf("week");
  const weekEnd = weekStart.endOf("week");
  // Check if there's a gap at the beginning of the week
  if (weekStart < firstCapacityDate) {
    transformedCapacities.push({
      startsOn: weekStart.toISODate(),
      endsOn: firstCapacityDate.minus({ days: 1 }).toISODate(),
      capacity: 0,
      isGap: true,
    });
  }
  for (let i = 0; i < sortedCapacities.length; i++) {
    const current = sortedCapacities[i];
    transformedCapacities.push(current);
    if (i < sortedCapacities.length - 1) {
      const next = sortedCapacities[i + 1];
      const currentEndDate = DateTime.fromISO(current.endsOn);
      const nextStartDate = DateTime.fromISO(next.startsOn);
      // Check if there's a gap between capacities
      if (currentEndDate.plus({ days: 1 }) < nextStartDate) {
        transformedCapacities.push({
          startsOn: currentEndDate.plus({ days: 1 }).toISODate(),
          endsOn: nextStartDate.minus({ days: 1 }).toISODate(),
          capacity: 0,
          isGap: true,
        });
      }
    }
  }
  // Check if there's a gap at the end of the week
  const lastCapacityDate = DateTime.fromISO(
    sortedCapacities[sortedCapacities.length - 1].endsOn
  );
  if (lastCapacityDate < weekEnd) {
    transformedCapacities.push({
      startsOn: lastCapacityDate.plus({ days: 1 }).toISODate(),
      endsOn: weekEnd.toISODate(),
      capacity: 0,
      isGap: true,
    });
  }
  return transformedCapacities;
};
