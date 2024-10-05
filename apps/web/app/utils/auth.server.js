import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "../utils/session.server.js";
import { db } from "../utils/db.js";

let authenticator = new Authenticator(sessionStorage);
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async ({ profile }) => {
    return await db.query.people.findFirst({
      where: (person, { eq }) => eq(person.email, profile.emails[0].value),
      columns: {
        email: true,
        id: true,
        role: true,
      },
    });
  },
);
authenticator.use(googleStrategy);

export { authenticator };
