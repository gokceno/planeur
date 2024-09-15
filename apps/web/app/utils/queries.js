import { projectsPeople } from "../schema.js";
import { db } from "../utils/db.js";

export const findAssignedProjectsByPeopleId = ({ peopleId }) => {
  return db.query.projects.findMany({
    where: (projects, { eq, inArray }) =>
      inArray(
        projects.id,
        db
          .select({ projectId: projectsPeople.projectId })
          .from(projectsPeople)
          .where(eq(projectsPeople.peopleId, peopleId))
      ),
    with: {
      people: {
        where: (projectsPeople, { eq }) =>
          eq(projectsPeople.peopleId, peopleId),
        with: { assignments: true },
      },
    },
  });
};

export const findAvailableProjectsByPeopleId = ({ peopleId }) => {
  return db.query.projects.findMany({
    where: (projects, { eq, notInArray }) =>
      notInArray(
        projects.id,
        db
          .select({ projectId: projectsPeople.projectId })
          .from(projectsPeople)
          .where(eq(projectsPeople.peopleId, peopleId))
      ),
  });
};
