import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { cache } from "hono/cache";
import { cors } from "hono/cors";

// Default caching is 1 hour (= 3600 seconds)
const CACHE_DURATION = 3600;
const BASE_CURR = "eur";

const app = new Hono();
app.use("/*", cors());

// serve JSON folder with currency names
app.use("/jsons/*", serveStatic({ root: "./" }));

// configure caching
app.use(
  "/currencies",
  cache({
    cacheName: "currency-rates",
    cacheControl: `max-age=${CACHE_DURATION}`,
    wait: true, // needed for Deno.js runtime
  })
);

app.get("/currencies", async (c) => {
  try {
    const resp = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${BASE_CURR}.json`
    );
    if (resp.ok) {
      const data = await resp.json();
      return c.json(data);
    }

    // fallback API URL
    const fallbackApiResp = await fetch(
      `https://latest.currency-api.pages.dev/v1/currencies/${BASE_CURR}.json`
    );
    if (fallbackApiResp.ok) {
      const data = await fallbackApiResp.json();
      return c.json(data);
    }
    // if both failed:
    throw new Error("API response from `@fawazahmed0/currency-api` not OK");
  } catch (error) {
    console.log("[ERROR]", error);
    return c.redirect("/jsons/currencies.json");
  }
});

app.get("/names", (c) => {
  return c.redirect("/jsons/names.json");
});

Deno.serve({ port: 8088 }, app.fetch);
