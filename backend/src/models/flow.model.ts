import mongoose, { Schema } from "mongoose";

const PageTextSchema = new Schema(
  {
    content: { type: String, required: true },
    position: {
      type: String,
      enum: [
        "TopLeft",
        "TopCenter",
        "TopRight",
        "MiddleLeft",
        "MiddleCenter",
        "MiddleRight",
        "BottomLeft",
        "BottomCenter",
        "BottomRight",
      ],
      required: true,
    },
    class: {
      type: String,
    },
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    background: { type: String, required: true },
    text: { type: PageTextSchema, required: true },
  },
  { _id: false }
);

const QuestionChoiceSchema = new Schema(
  {
    text: { type: String, required: true },
    audio: {
      type: [String],
      validate: [(arr: any[]) => arr.length === 3, "Audio array must have 3 elements"],
    },
    options: {
      type: [String],
      validate: [(arr: any[]) => arr.length === 2, "Options array must have 2 elements"],
    },
  },
  { _id: false }
);

const FeedbackListSchema = new Schema(
  {
    text: { type: String, required: true },
    audio: { type: String, required: true },
  },
  { _id: false }
);

const FeedbackSchema = new Schema(
  {
    list: {
      type: [FeedbackListSchema],
      validate: [(arr: any[]) => arr.length === 2, "List must contain 2 elements"],
      required: true,
    },
    option: { type: String, required: true },
  },
  { _id: false }
);

const PositionSchema = new Schema(
  {
    x: {
      type: String,
      required: true,
    },
    y: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const NodeSchema = new Schema(
  {
    type: { type: String, enum: ["base", "question", "choice"], required: true },
    id: { type: String, required: true },
    label: { type: String, required: true },
    pages: {
      type: [PageSchema],
      validate: [(arr: any[]) => arr.length === 2, "Pages array must contain 2 elements"],
      required: true,
    },
    audio: { type: String, required: true },
    question: { type: QuestionChoiceSchema, default: undefined },
    choice: { type: QuestionChoiceSchema, default: undefined },
    values: {
      type: [String],
      validate: [
        (arr: any[]) => arr.length === 2,
        "Values array must contain 2 elements",
      ],
      default: undefined,
    },
    feedback: { type: FeedbackSchema, default: undefined },
    nextSteps: {
      type: [Number],
      validate: [
        (arr: any[]) => arr.length === 2,
        "NextSteps array must contain 2 elements",
      ],
      default: undefined,
    },
    position: {
      type: PositionSchema,
      required: true,
    },
  },
  { _id: false }
);

NodeSchema.methods.toJSON = function () {
  const node = this.toObject();

  delete node._id;
  delete node.__v;

  return node;
};

const EdgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
  },
  { _id: false }
);

EdgeSchema.methods.toJSON = function () {
  const edge = this.toObject();

  delete edge._id;
  delete edge.__v;

  return edge;
};

const flowSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  label: { type: String, required: true, unique: true },
  nodes: { type: [NodeSchema], required: true },
  edges: { type: [EdgeSchema], required: true },
}).index({ userId: 1, label: 1 }, { unique: true });

flowSchema.methods.toJSON = function () {
  const flow = this.toObject();

  delete flow.userId;
  delete flow.__v;

  return flow;
};

export default mongoose.model("flow", flowSchema);
