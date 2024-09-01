import { DateTime, Interval, Duration } from "luxon";

const DateHeader = ({ startsOn: _startsOn, endsOn: _endsOn }) => {
  const startsOn = DateTime.fromISO(_startsOn);
  const endsOn = DateTime.fromISO(_endsOn);
  const spanInterval = Interval.fromDateTimes(startsOn, endsOn);
  const spans = spanInterval
    .splitBy(Duration.fromObject({ day: 1 }))
    .map((i) => i.start);

  return (
    <div className="grid grid-cols-7 gap-2 mb-4 text-sm font-semibold text-center">
      {spans.map((date, index) => (
        <div key={index}>{date.toFormat('LLL dd')}</div>
      ))}
    </div>
  );
};

export default DateHeader;
