import { useState } from "react";

export default function AssignmentsRoute() {
  const [assignments, setAssignments] = useState([]);

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      { startDate: "", endDate: "", capacity: 1 },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
  };

  const handleRemoveAssignment = (index) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
  };

  return (
    <div className="container mx-auto p-4">
      <p className="mb-4">Below are the projects you have access to:</p>
      <form className="space-y-4">
        {assignments.map((assignment, index) => (
          <div key={index} className="flex space-x-4 items-center">
            <input
              type="date"
              className="form-input px-4 py-2 border rounded"
              value={assignment.startDate}
              onChange={(e) =>
                handleInputChange(index, "startDate", e.target.value)
              }
            />
            <input
              type="date"
              className="form-input px-4 py-2 border rounded"
              value={assignment.endDate}
              onChange={(e) =>
                handleInputChange(index, "endDate", e.target.value)
              }
            />
            <input
              type="number"
              className="form-input px-4 py-2 border rounded"
              min="1"
              max="8"
              step="0.1"
              value={assignment.capacity}
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
                className="h-6 w-6"
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
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddAssignment}
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
}
