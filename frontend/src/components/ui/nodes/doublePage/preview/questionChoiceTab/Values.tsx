import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

function Values() {
  const form = useFormContext<PageSchema>();
  const [firstValue, secondValue] = form.getValues(["values.0", "values.1"]);

  return (
    <div className="mt-3 flex flex-col justify-center items-center gap-x-2">
      <div className="flex justify-center items-center">
        <span className="font-extrabold">Primo valore: </span> {firstValue}
      </div>
      <div className="flex justify-center items-center">
        <span className="font-extrabold">Secondo valore: </span> {secondValue}
      </div>
    </div>
  );
}

export default Values;
