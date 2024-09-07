import { DateTime, Interval } from "luxon";
import { useTailwindColor } from "../hooks/color.js";

const transformGaps = (capacities) => {
  if (!capacities || capacities.length < 2) {
    return capacities; // Return original capacities if there's not enough entries
  }
  const unGappedCapacities = [];
  const sortedCapacities = capacities.sort((a, b) =>
    DateTime.fromISO(a.startsOn) < DateTime.fromISO(b.startsOn) ? -1 : 1
  );
  for (let i = 0; i < sortedCapacities.length; i++) {
    const current = sortedCapacities[i];
    unGappedCapacities.push(current);
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
        unGappedCapacities.push({
          startsOn: gapInterval.start.toISODate(),
          endsOn: gapInterval.end.toISODate(),
          capacity: 0,
          isGap: true,
        });
      }
    }
  }
  return unGappedCapacities;
};

const CapacityBar = ({
  title,
  capacities: gappedCapacities,
  startsOn: _startsOn,
  endsOn: _endsOn,
}) => {
  const startsOn = DateTime.fromISO(_startsOn);
  const endsOn = DateTime.fromISO(_endsOn);
  const maxColSpans = 7;
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
  const remainingSpans = capacities.reduce(
    (a, c) => a - c.span - 1,
    maxColSpans
  );
  const { backgroundColor, textColor } = useTailwindColor(title);
  return (
    <div className="w-3/4 grid grid-cols-7 gap-1">
      {capacities.map(({ classNames, capacity, isGap }, i) => (
        <div
          key={i}
          className={[
            textColor,
            "p-2",
            "rounded",
            isGap ? "bg-gray-200" : "bg-" + backgroundColor,
          ]
            .concat(classNames)
            .join(" ")}
        >
          {isGap !== true && capacity + "h/d"}
        </div>
      ))}
      {remainingSpans > 0 && remainingSpans <= maxColSpans && (
        <div className={`rounded bg-gray-200 col-span-${remainingSpans}`}></div>
      )}
    </div>
  );
};

export default CapacityBar;
