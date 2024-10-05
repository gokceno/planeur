import { defineAbility } from "@casl/ability";

export default (user) =>
  defineAbility((can) => {
    if (user && ["USER", "MANAGER", "ADMIN"].includes(user.role)) {
      can("view", "Projects");
    }
    if (user && ["MANAGER", "ADMIN"].includes(user.role)) {
      can("edit", "Projects");
      can("edit", "ProjectsAssignments");
    }
  });
