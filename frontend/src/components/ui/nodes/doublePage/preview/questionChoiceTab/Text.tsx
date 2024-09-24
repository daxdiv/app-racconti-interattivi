type TextProps = {
  data: DoublePageNodeDataWithoutPreview;
  field: "question" | "choice";
  audio: string | undefined;
};

function Text({ data, field, audio }: TextProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-x-2 mb-4">
      {data[field]?.text && (
        <p className="break-words">
          <span className="font-extrabold">Testo: </span>
          {data[field]?.text}
        </p>
      )}

      {audio && (
        <audio
          controls
          autoPlay={false}
        >
          <source
            src={audio}
            type="audio/mp3"
          />
        </audio>
      )}
    </div>
  );
}

export default Text;
