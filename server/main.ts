import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { cache } from "hono/cache";
import { cors } from "hono/cors";

// Default caching is 1 hour (= 3600 seconds)
const CACHE_DURATION_SECONDS = 3600;

const app = new Hono();
app.use("/*", cors());

// serve JSON folder with currency names
app.use("/jsons/*", serveStatic({ root: "./" }));

// configure caching
app.use(
  "/currencies",
  cache({
    cacheName: "currency-rates",
    cacheControl: `max-age=${CACHE_DURATION_SECONDS}`,
    wait: true, // needed for Deno.js runtime
  })
);

app.get("/currencies", (c) => {
  return c.redirect("/jsons/currencies.json");
});

app.get("/names", (c) => {
  return c.redirect("/jsons/names.json");
});

Deno.serve({ port: 8088 }, app.fetch);
