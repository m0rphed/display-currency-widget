import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/*", cors());

// serve JSON folder with currency names
app.use("/jsons/*", serveStatic({ root: "./" }));

app.get("/currencies", (c) => {
  return c.redirect("/jsons/currencies.json");
});

app.get("/names", (c) => {
  return c.redirect("/jsons/names.json");
});

Deno.serve(app.fetch);
