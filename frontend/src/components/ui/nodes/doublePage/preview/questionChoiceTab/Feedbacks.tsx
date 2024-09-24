type FeedbacksProps = {
  data: DoublePageNodeDataWithoutPreview;
  field: "question" | "choice";
  audios: (string | undefined)[];
};

function Feedbacks({ data, field, audios }: FeedbacksProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-x-5 mt-6">
      <div className="flex-col">
        <p className="font-extrabold">Feedback scegliendo "{data[field]?.options[0]}"</p>

        <div className="flex justify-center items-center flex-col mb-4">
          <p className="text-sm break-words">{data[field]?.feedback.list[0].text}</p>
          <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-24 text-sm mt-2">
            Continuare
          </div>
        </div>

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
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2">
            Nessun audio selezionato
          </p>
        )}
      </div>
      <div className="flex-col mt-3">
        <p className="font-extrabold">Feedback scegliendo "{data[field]?.options[1]}"</p>

        <div className="flex justify-center items-center flex-col mb-4">
          <p className="text-sm break-words">{data[field]?.feedback.list[1].text}</p>
          <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-24 text-sm mt-2">
            Continuare
          </div>
        </div>

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
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2">
            Nessun audio selezionato
          </p>
        )}
      </div>
    </div>
  );
}

export default Feedbacks;
