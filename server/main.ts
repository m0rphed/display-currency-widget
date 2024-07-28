import { Hono } from "hono";
import { serveStatic } from "hono/deno"
import { cors } from "hono/cors";

const app = new Hono();
app.use("/*", cors());

// serve JSON folder with currency names

app.use("/jsons/*", serveStatic({root: "./"}))
Deno.serve(app.fetch);

export default app
