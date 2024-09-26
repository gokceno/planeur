import { authenticator } from "../utils/auth.server";
import { redirect } from "@remix-run/node";

export let loader = () => redirect("/login");
export let action = ({ request }) => {
  return authenticator.authenticate("google", request);
};
