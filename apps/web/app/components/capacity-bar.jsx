import { DateTime, Interval } from "luxon";

const CapacityBar = ({
  capacities: _capacities,
  startsOn: _startsOn,
  endsOn: _endsOn,
  barColorClassName,
}) => {
  const startsOn = DateTime.fromISO(_startsOn);
  const endsOn = DateTime.fromISO(_endsOn);
  const daySpan = endsOn.diff(startsOn, "days").days;
  const availableColSpans = [
    "col-span-1",
    "col-span-2",
    "col-span-3",
    "col-span-4",
    "col-span-5",
  ];
  const maxSpans = availableColSpans.length;
  const daySpanInterval = Interval.fromDateTimes(startsOn, endsOn);
  const capacities = _capacities
    .filter(
      (c) =>
        daySpanInterval.contains(DateTime.fromISO(c.startsOn)) &&
        daySpanInterval.contains(DateTime.fromISO(c.endsOn)),
    )
    .map((c) => {
      const span =
        DateTime.fromISO(c.endsOn).diff(DateTime.fromISO(c.startsOn), "days")
          .days || 0;
      return {
        capacity: c.capacity,
        classNames: ["col-span-" + span],
        span,
      };
    });
  const remainingSpans = capacities.reduce((a, c) => a - c.span, maxSpans);
  return (
    <div className="w-3/4 grid grid-cols-5 gap-1">
      {capacities.map(({ classNames, capacity }, i) => (
        <div
          key={i}
          className={["p-2", "rounded", barColorClassName ?? "bg-yellow-200"]
            .concat(classNames)
            .join(" ")}
        >
          {capacity} h/d
        </div>
      ))}
      {remainingSpans > 0 && remainingSpans <= maxSpans && (
        <div className={`rounded bg-gray-200 col-span-${remainingSpans}`}></div>
      )}
    </div>
  );
};

export default CapacityBar;
