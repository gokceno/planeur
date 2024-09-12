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
