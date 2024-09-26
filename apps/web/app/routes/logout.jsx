import { authenticator } from "../utils/auth.server";

export const loader = async({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login/" });
}
