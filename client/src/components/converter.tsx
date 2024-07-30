import CardRow from "./card-row.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

import "jsr:@std/dotenv/load";
const BASE_URL = Deno.env.get("VITE_BE_ENV");

const Converter = () => {
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
