const DateHeaders = () => {
  return (
    <div className="grid grid-cols-7 gap-2 mb-4 text-sm font-semibold text-center">
      {[
        "10 Jan",
        "11 Jan",
        "12 Jan",
        "13 Jan",
        "14 Jan",
        "15 Jan",
        "16 Jan",
      ].map((date, index) => (
        <div key={index}>{date}</div>
      ))}
    </div>
  );
}

export default DateHeaders;