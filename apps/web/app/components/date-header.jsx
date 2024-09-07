import { DateTime, Interval, Duration } from "luxon";

const DateHeader = ({ startsOn: _startsOn, endsOn: _endsOn }) => {
  const startsOn = DateTime.fromISO(_startsOn);
  const endsOn = DateTime.fromISO(_endsOn);
  const spanInterval = Interval.fromDateTimes(startsOn, endsOn);
  const spans = spanInterval
    .splitBy(Duration.fromObject({ day: 1 }))
    .map((i) => i.start);

  return (
    <div className="grid grid-cols-7 mb-4 text-sm font-semibold ml-96 w-3/4">
      {spans.map((date, index) => (
        <div
          key={index}
          className={`${date.weekday >= 6 ? "text-gray-400" : ""} ${
            date.hasSame(DateTime.now(), "day") ? "underline" : ""
          }`}
        >
          {date.toFormat("LLL dd")}
        </div>
      ))}
    </div>
  );
};

export default DateHeader;
