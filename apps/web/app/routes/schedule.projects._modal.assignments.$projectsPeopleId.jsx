import { useState, useEffect } from "react";
import { db } from "../utils/db.js";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useFetcher,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { projectsAssignments } from "../schema.js";
import { eq } from "drizzle-orm";

export const action = async ({ request, params }) => {
  // const form = await request.formData();
  const { projectsPeopleId } = params;
  await db
    .delete(projectsAssignments)
    .where(eq(projectsAssignments.projectsPeopleId, projectsPeopleId));
  return json({ ok: true });
};

export const loader = async ({ params }) => {
  const { projectsPeopleId } = params;
  const assignments = await db.query.projectsAssignments.findMany({
    where: (projectsAssignments, { eq }) =>
      eq(projectsAssignments.projectsPeopleId, projectsPeopleId),
  });
  return json({
    assignments,
  });
};

export const AssignmentsRoute = () => {
  const { assignments: loadedAssignments } = useLoaderData();
  const [assignments, setAssignments] = useState(loadedAssignments);

  const [searchParams] = useSearchParams();
  const selectedWeek = searchParams.get("w") ?? DateTime.local().toISODate();

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      { startDate: "", endDate: "", capacity: 0 },
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
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data && fetcher.data.ok) {
      navigate(`/schedule/projects/?w=${selectedWeek}`);
    }
  }, [fetcher.data, navigate, selectedWeek]);
  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <fetcher.Form className="space-y-3 w-full max-w-2xl" method="post">
          {assignments.map((assignment, index) => (
            <div key={index} className="flex space-x-3 items-center">
              <input
                type="date"
                name="startsOn"
                className="form-input px-3 py-1 border rounded text-xs"
                value={assignment.startsOn}
                onChange={(e) =>
                  handleInputChange(index, "startDate", e.target.value)
                }
              />
              <input
                type="date"
                name="endsOn"
                className="form-input px-3 py-1 border rounded text-xs"
                value={assignment.endsOn}
                onChange={(e) =>
                  handleInputChange(index, "endDate", e.target.value)
                }
              />
              <input
                type="number"
                name="capacity"
                className="form-input px-3 py-1 border rounded text-xs"
                min="1"
                max="8"
                step="0.5"
                value={assignment.capacity}
                onChange={(e) =>
                  handleInputChange(
                    index,
                    "capacity",
                    parseFloat(e.target.value)
                  )
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
            </div>
          ))}
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-xs mr-2"
            onClick={handleAddAssignment}
          >
            Add Row
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs"
          >
            Save & Close
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default AssignmentsRoute;
