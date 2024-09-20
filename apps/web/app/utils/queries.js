import { projectsPeople } from "../schema.js";
import { db } from "../utils/db.js";

export const findAssignedPeopleByProjectId = ({ projectId }) => {
  return db.query.projectsPeople.findMany({
    where: (projectsPeople, { eq }) => eq(projectsPeople.projectId, projectId),
    with: {
      person: true,
      project: true,
      assignments: true,
    },
  });
};

export const findAvailablePeopleByProjectId = ({ projectId }) => {
  return db.query.people.findMany({
    where: (people, { eq, notInArray }) =>
      notInArray(
        people.id,
        db
          .select({ peopleId: projectsPeople.peopleId })
          .from(projectsPeople)
          .where(eq(projectsPeople.projectId, projectId))
      ),
  });
};

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
