interface BaseCurrencyApiResponse {
  date: string;
}

interface CurrencyData {
  [key: string]: Record<string, number>;
}

type CurrencyApiResponse = BaseCurrencyApiResponse & CurrencyData;

interface UnifiedApiResponse {
  success: boolean;
  timestamp?: number;
  Abase: string;
  date: string;
  rates: Record<string, number>;
}

export type { CurrencyApiResponse, UnifiedApiResponse };
