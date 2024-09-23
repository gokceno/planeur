import { DateTime } from "luxon";

export const transformProjectsViaPeopleWithAssignments = (
  people,
  startsOn,
  endsOn
) => {
  return people.map((person) => {
    const capacityMap = new Map();
    person.projects.forEach((project) => {
      project.assignments.forEach((assignment) => {
        const assignmentStart = DateTime.fromISO(assignment.startsOn);
        const assignmentEnd = DateTime.fromISO(assignment.endsOn);
        // Calculate the overlap with the limit range
        const start = assignmentStart < startsOn ? startsOn : assignmentStart;
        const end = assignmentEnd > endsOn ? endsOn : assignmentEnd;
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
    const totalCapacity = capacities.reduce(
      (sum, capacity) => sum + capacity.capacity,
      0
    );
    return { ...person, capacities, totalCapacity };
  });
};

export const transformPeopleWithAssignments = (people, startsOn, endsOn) => {
  return people.map((person) => {
    const capacityMap = new Map();
    person.assignments.forEach((assignment) => {
      const assignmentStart = DateTime.fromISO(assignment.startsOn);
      const assignmentEnd = DateTime.fromISO(assignment.endsOn);
      // Calculate the overlap with the limit range
      const start = assignmentStart < startsOn ? startsOn : assignmentStart;
      const end = assignmentEnd > endsOn ? endsOn : assignmentEnd;
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
    return { ...person, capacities };
  });
};

export const transformProjects = (inputArray, limitStart, limitEnd) => {
  return inputArray.map((project) => {
    const capacityMap = new Map();
    project.people.forEach((person) => {
      person.assignments.forEach((assignment) => {
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
    const totalCapacity = capacities.reduce(
      (sum, capacity) => sum + capacity.capacity,
      0
    );
    return {
      projectName: project.projectName,
      id: project.id,
      capacities,
      totalCapacity,
    };
  });
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
