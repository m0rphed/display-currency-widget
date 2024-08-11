# Exchange rates API (Deno + Hono.JS)

Run with:

```bash
deno task start
```

Deploy via [Deno Deploy](https://deno.com/deploy):

```bash
deployctl deploy --env-file=./.env --project=currency-exchange-rates
```

Environment variables required for API server:

```.env
EXCHANGE_RATES_API=""
EXCHANGE_RATES_API_FALLBACK=""
```

## Exchange rates providers and API

- Free Currency Exchange Rates API 👉 [GitHub](https://github.com/fawazahmed0/exchange-api), [npm package](https://www.npmjs.com/package/@fawazahmed0/currency-api)
- Exchange Rates by ECB (European Central Bank) uses public ECB API, updated per day at around `00:00 GMT` 👉 [npm package](https://www.npmjs.com/package/exchange-rates-ecb)
