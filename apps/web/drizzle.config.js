import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  dbCredentials: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
  },
  schema: "./app/schema.js",
  out: "../../db/migrations/",
  driver: "turso",
  dialect: "sqlite",
});
