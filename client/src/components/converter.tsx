import "jsr:@std/dotenv/load";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import CardRow from "./card-row.tsx";
import useSWR from "swr";

const BASE_URL = Deno.env.get("VITE_BE_ENV");

const Converter = () => {
  const {
    data: namesData,
    error: namesError,
    isLoading: isNamesLoading,
  } = useSWR(`${BASE_URL}/names`, (url) => {
    fetch(url).then((res) => res.json());
  });

  const {
    data: currenciesData,
    error: currenciesError,
    isLoading: isCurrenciesLoading,
  } = useSWR(`${BASE_URL}/currencies`, (url) => {
    fetch(url).then((res) => res.json());
  });

  console.log(currenciesData, namesData, "DATA");

  return (
    <Card className="max-width-300px">
      <CardHeader className="border-b-2 p-2 m-2">
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <CardRow />
        <CardRow />
      </CardContent>
    </Card>
  );
};

export default Converter;
