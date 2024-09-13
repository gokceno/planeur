import { DateTime, Interval } from "luxon";
import { transformGaps } from "../utils/transformers.js";
import { userColorPicker } from "../hooks/color-picker.js";

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
