import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

import CardRow from "./card-row.tsx";
import useSWR from "swr";
import LoaderComponent from "./loader-component.tsx";
import ErrorComponent from "./error-component.tsx";
import { useState, useEffect, ChangeEvent } from "react";
import modifyNames from "@/lib/utils/modifyNames.ts";
import calculateExchangeRate from "@/lib/utils/calcRate.ts";

// [WARNING] Deno v1.45.4
// Because of current state of "Deno + Vite"
// -> `import.meta.env.VITE_VARIABLE_NAME` is used for retrieving .env variables,
// instead of `Deno.env.get("VAR_NAME")`
// - which would be marked as error by Deno LSP,
// because Deno by itself does not define `import.meta.env`
const BASE_URL = import.meta.env.VITE_BE_URL;
// console.log(`\n[DEBUG]: BASE_URL of backend is '${BASE_URL}'`);

const Converter = () => {
  const [isForward, setIsForward] = useState<boolean>(true);
  const [sourceCurrency, setSourceCurrency] = useState<string | undefined>();
  const [targetCurrency, setTargetCurrency] = useState<string | undefined>();
  const [exchangeRate, setExchangeRate] = useState<number>(1); // current exchange rates between 2 currencies
  const [amount, setAmount] = useState<string>("1");

  let sourceAmount;
  let targetAmount;

  if (isForward) {
    sourceAmount = amount;
    targetAmount = (Number(amount) * exchangeRate).toFixed(2);
  } else {
    targetAmount = amount;
    sourceAmount = (Number(amount) / exchangeRate).toFixed(2);
  }

  const {
    data: namesData,
    error: namesError,
    isLoading: isNamesLoading,
  } = useSWR(`${BASE_URL}/names`, (url) =>
    fetch(url).then(async (res) => {
      const data = await res.json();
      return modifyNames(data);
    })
  );

  const {
    data: currenciesData,
    error: currenciesError,
    isLoading: isCurrenciesLoading,
  } = useSWR(`${BASE_URL}/currencies`, (url) =>
    fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (namesData && currenciesData) {
      !sourceCurrency && setSourceCurrency(namesData?.[0].abv);
      !targetCurrency && setTargetCurrency(namesData?.[1].abv);
      const calculatedRate = calculateExchangeRate(
        sourceCurrency || namesData?.[0].abv,
        targetCurrency || namesData?.[1].abv,
        currenciesData
      );
      setExchangeRate(calculatedRate);
    }
  }, [namesData, currenciesData, sourceCurrency, targetCurrency]);

  const handleChangeSourceAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setIsForward(true);
    setAmount(e.target.value);
  };

  const handleChangeTargetAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setIsForward(false);
    setAmount(e.target.value);
  };

  if (isCurrenciesLoading || isNamesLoading) {
    return <LoaderComponent />;
  }

  if (currenciesError || namesError) {
    return <ErrorComponent message="ErrorFetching data!" />;
  }

  return (
    <Card className="max-width-300px">
      <CardHeader className="border-b-2 p-2 m-2">
        <CardTitle>
          {sourceAmount} {sourceCurrency}
        </CardTitle>
        <CardDescription>
          {targetAmount} {targetCurrency}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardRow
          amount={sourceAmount}
          handleChangeAmount={handleChangeSourceAmount}
          selectedCurrency={sourceCurrency}
          handleChangeCurrency={(value: string) => setSourceCurrency(value)}
          currencyNames={namesData}
        />
        <CardRow
          amount={targetAmount}
          handleChangeAmount={handleChangeTargetAmount}
          selectedCurrency={targetCurrency}
          handleChangeCurrency={(value: string) => setTargetCurrency(value)}
          currencyNames={namesData}
        />
      </CardContent>
    </Card>
  );
};

export default Converter;
