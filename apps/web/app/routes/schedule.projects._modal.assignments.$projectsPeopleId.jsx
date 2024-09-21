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
import CapacityInputWithDates from "../components/capacity-input-with-dates.jsx";

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const startsOn = form.getAll("startsOn");
  const endsOn = form.getAll("endsOn");
  const capacity = form.getAll("capacity");
  const { projectsPeopleId } = params;
  await db
    .delete(projectsAssignments)
    .where(eq(projectsAssignments.projectsPeopleId, projectsPeopleId));

  for (let i = 0; i < startsOn.length; i++) {
    await db.insert(projectsAssignments).values({
      projectsPeopleId,
      startsOn: startsOn[i],
      endsOn: endsOn[i],
      capacity: capacity[i],
    });
  }

  return json({ ok: true });
};

export const loader = async ({ params }) => {
  const { projectsPeopleId } = params;
  const assignments = await db.query.projectsAssignments.findMany({
    where: (projectsAssignments, { eq }) =>
      eq(projectsAssignments.projectsPeopleId, projectsPeopleId),
    orderBy: (projectsAssignments, { asc }) => [
      asc(projectsAssignments.startsOn),
      asc(projectsAssignments.endsOn),
    ],
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

  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data && fetcher.data.ok) {
      navigate(`/schedule/projects/?w=${selectedWeek}`);
    }
  }, [fetcher.data, navigate, selectedWeek]);

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
    <div className="container mx-auto">
      <div className="flex flex-col">
        <fetcher.Form className="space-y-3 w-full max-w-2xl" method="post">
          {assignments.map((assignment, i) => (
            <CapacityInputWithDates
              key={i}
              index={i}
              handleInputChange={handleInputChange}
              handleRemoveAssignment={handleRemoveAssignment}
              startsOn={assignment.startsOn}
              endsOn={assignment.endsOn}
              capacity={assignment.capacity}
            />
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
