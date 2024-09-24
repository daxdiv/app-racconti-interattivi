type ValuesProps = {
  data: DoublePageNodeDataWithoutPreview;
  field: "question" | "choice";
};

function Values({ data, field }: ValuesProps) {
  return (
    <div className="mt-3 flex flex-col justify-center items-center gap-x-2">
      <div className="flex justify-center items-center">
        <span className="font-extrabold">Primo valore: </span> {data[field]?.values[0]}
      </div>
      <div className="flex justify-center items-center">
        <span className="font-extrabold">Secondo valore: </span> {data[field]?.values[1]}
      </div>
    </div>
  );
}

export default Values;
