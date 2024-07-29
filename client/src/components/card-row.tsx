import {useForm} from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    amount: z.number().positive().multipleOf(0.01),
    currency: z.string(),
})

const CardRow = () => {
    const form = useForm<z.infer<typeof formSchema>>(
    )
  return <div>CardRow</div>;
};

export default CardRow;
