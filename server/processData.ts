import { CurrencyApiResponse, UnifiedApiResponse } from "./types.ts";

function getTimestamp(dateStr: string): number {
  return new Date(dateStr).getTime() / 1000;
}

export function parseKnownCurrencies(
  baseCode: string,
  data: CurrencyApiResponse,
  knownCurrencies: Set<string>
): UnifiedApiResponse {
  const processed: UnifiedApiResponse = {
    success: true,
    timestamp: data.date ? getTimestamp(data.date) : undefined,
    Abase: baseCode.toUpperCase(),
    date: data.date,
    rates: {},
  };

  const currencyData = data[baseCode] as Record<string, number>;
  // if response does not include
  // base currency rate - we should add it
  if (!Object.keys(currencyData).includes(baseCode)) {
    processed.rates[baseCode.toUpperCase()] = 1;
  }

  for (const [key, value] of Object.entries(currencyData)) {
    const currCode = key.toUpperCase();
    if (knownCurrencies.has(currCode)) {
      processed.rates[currCode] = value;
      continue;
    }
  }

  return processed;
}
