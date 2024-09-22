import { DateTime } from "luxon";

const CapacityInputWithDates = ({
  handleRemoveAssignment,
  handleInputChange,
  startsOn,
  endsOn,
  capacity,
  index,
}) => {
  const calculateTotalHours = () => {
    if (!startsOn || !endsOn || !capacity) return 0;

    const start = DateTime.fromISO(startsOn);
    const end = DateTime.fromISO(endsOn);
    const days = end.diff(start, "days").days + 1;
    return days * capacity;
  };

  return (
    <div className="flex space-x-3 items-center">
      <input
        type="date"
        name="startsOn"
        className="form-input px-3 py-1 border rounded text-xs"
        value={startsOn}
        onChange={(e) => handleInputChange(index, "startsOn", e.target.value)}
      />
      <input
        type="date"
        name="endsOn"
        className="form-input px-3 py-1 border rounded text-xs"
        value={endsOn}
        onChange={(e) => handleInputChange(index, "endsOn", e.target.value)}
      />
      <input
        type="number"
        name="capacity"
        className="form-input px-3 py-1 border rounded text-xs"
        min="1"
        max="24"
        step="0.5"
        value={capacity}
        onChange={(e) =>
          handleInputChange(index, "capacity", parseFloat(e.target.value))
        }
      />
      <button
        type="button"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleRemoveAssignment(index)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <span className="text-xs bg-gray-300 p-1 px-2 rounded">
        {`${calculateTotalHours().toFixed(1)} hrs`}
      </span>
    </div>
  );
};

export default CapacityInputWithDates;
