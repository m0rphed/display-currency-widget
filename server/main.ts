import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import "@std/dotenv/load";
import { parseKnownCurrencies } from "./processData.ts";
import { CurrencyApiResponse } from "./types.ts";

// main exchange rates provider: https://github.com/fawazahmed0/exchange-api
// URL_MAIN: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/"
const URL_MAIN = Deno.env.get("EXCHANGE_RATES_API");
const URL_FALLBACK = Deno.env.get("EXCHANGE_RATES_API_FALLBACK");

// configure caching
const CACHE_DURATION = 3600; 
// base currency is EURO by default
const BASE_CURR = "eur";

// Pre-load names for filtering
async function getSupportedCodes(path: string): Promise<Set<string>> {
  const namesData = JSON.parse(await Deno.readTextFile(path));
  return new Set<string>(Object.keys(namesData));
}

const supported = await getSupportedCodes("./jsons/names.json");

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
    const resp = await fetch(`${URL_MAIN}${BASE_CURR}.json`);
    if (resp.ok) {
      const data: CurrencyApiResponse = await resp.json();
      const processedData = parseKnownCurrencies(BASE_CURR, data, supported);
      return c.json(processedData);
    }

    // fallback API URL
    const fallbackApiResp = await fetch(`${URL_FALLBACK}${BASE_CURR}.json`);
    if (fallbackApiResp.ok) {
      const data: CurrencyApiResponse = await fallbackApiResp.json();
      const processedData = parseKnownCurrencies(BASE_CURR, data, supported);
      return c.json(processedData);
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
