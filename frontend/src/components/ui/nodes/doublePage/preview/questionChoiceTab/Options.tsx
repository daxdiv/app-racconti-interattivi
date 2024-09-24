type OptionsProps = {
  data: DoublePageNodeDataWithoutPreview;
  field: "question" | "choice";
  audios: (string | undefined)[];
};

function Options({ data, field, audios }: OptionsProps) {
  return (
    <div>
      <div className="flex justify-center items-center gap-x-5">
        <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
          <p>{data[field]?.options[0]}</p>
        </div>
        <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
          <p>{data[field]?.options[1]}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-center items-center gap-x-2">
        {audios[0] ? (
          <audio
            controls
            autoPlay={false}
          >
            <source
              src={audios[0]}
              type="audio/mp3"
            />
          </audio>
        ) : (
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-1/2">
            Nessun audio selezionato
          </p>
        )}

        {audios[1] ? (
          <audio
            controls
            autoPlay={false}
          >
            <source
              src={audios[1]}
              type="audio/mp3"
            />
          </audio>
        ) : (
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-1/2">
            Nessun audio selezionato
          </p>
        )}
      </div>
    </div>
  );
}

export default Options;
