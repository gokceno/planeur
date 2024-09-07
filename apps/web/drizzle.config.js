import { defineConfig } from "drizzle-kit";

export default defineConfig({
  url: "file:../../db/db.sqlite",
  schema: "./app/schema.js",
  out: "../../db/migrations/",
  dialect: "sqlite",
});
