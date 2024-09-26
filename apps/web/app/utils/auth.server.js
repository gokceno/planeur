import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "../utils/session.server.js";

let authenticator = new Authenticator(sessionStorage);
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async ({ profile }) => {
    return profile.emails[0].value;
  }
);
authenticator.use(googleStrategy);

export { authenticator };
