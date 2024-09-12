import { DateTime, Interval } from "luxon";
import { userColorPicker } from "../hooks/color-picker.js";

const transformGaps = (capacities) => {
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

const CapacityBar = ({
  title,
  capacities: gappedCapacities,
  startsOn: _startsOn,
  endsOn: _endsOn,
  style = "large", // small
}) => {
  const startsOn = DateTime.fromISO(_startsOn);
  const endsOn = DateTime.fromISO(_endsOn);
  const daySpanInterval = Interval.fromDateTimes(startsOn, endsOn);
  const unGappedCapacities = transformGaps(gappedCapacities);
  const capacities = unGappedCapacities
    .filter(
      (c) =>
        daySpanInterval.contains(DateTime.fromISO(c.startsOn)) &&
        daySpanInterval.contains(DateTime.fromISO(c.endsOn))
    )
    .map((c) => {
      const span =
        DateTime.fromISO(c.endsOn).diff(DateTime.fromISO(c.startsOn), "days")
          .days || 0;
      return {
        capacity: c.capacity,
        classNames: ["col-span-" + (span + 1)],
        span,
        isGap: c.isGap,
      };
    });
  const { backgroundColor, textColor } = userColorPicker(title);

  return (
    <div className="w-3/4 grid grid-cols-7 gap-1">
      {capacities.map(({ classNames, capacity, isGap }, i) => (
        <div
          key={i}
          className={[
            textColor,
            style === "small" ? "p-1" : "p-2",
            style === "small" ? "text-xs" : "text-base",
            "rounded",
            isGap ? "bg-gray-200" : "bg-" + backgroundColor,
          ]
            .concat(classNames)
            .join(" ")}
        >
          {isGap !== true && capacity + " h/d"}
        </div>
      ))}
      {!capacities.length && (
        <div
          className={`rounded bg-gray-200 col-span-7 ${
            style === "small" ? "p-3" : "p-5"
          }`}
        ></div>
      )}
    </div>
  );
};

export default CapacityBar;
