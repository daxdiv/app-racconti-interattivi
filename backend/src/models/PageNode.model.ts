import mongoose, { Schema } from "mongoose";

type PageTextSchema = {
  content: string;
  position: PageTextPosition;
  class?: string;
};
type PageSchema = {
  background: string;
  text: Schema<PageTextSchema>;
};
type QuestionChoiceSchema = {
  text: string;
  audio: [string, string, string];
  options: [string, string];
};
type FeedbackListSchema = {
  text: string;
  audio: string;
};
type FeedbackSchema = {
  list: [Schema<FeedbackListSchema>, Schema<FeedbackListSchema>];
  option: string;
};
type NodeModelSchema = {
  type: "base" | "question" | "choice";
  nodeId: string;
  label: string;
  pages: [Schema<PageSchema>, Schema<PageSchema>];
  audio: string;
  question?: Schema<QuestionChoiceSchema>;
  choice?: Schema<QuestionChoiceSchema>;
  values?: [string, string];
  feedback?: Schema<FeedbackSchema>;
  nextSteps?: [number, number];
};

const pageTextSchema = new mongoose.Schema<PageTextSchema>({
  content: {
    type: String,
    required: true,
  },
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
});
const pageSchema = new mongoose.Schema<PageSchema>({
  background: {
    type: String,
    required: true,
  },
  text: pageTextSchema,
});
const questionChoiceSchema = new mongoose.Schema<QuestionChoiceSchema>({
  text: {
    type: String,
    required: true,
  },
  audio: {
    type: [String, String, String],
    required: true,
  },
  options: {
    type: [String, String],
    required: true,
  },
});
const feedbackListSchema = new mongoose.Schema<FeedbackListSchema>({
  text: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
});
const feedbackSchema = new mongoose.Schema<FeedbackSchema>({
  list: {
    type: [feedbackListSchema],
    required: true,
  },
  option: {
    type: String,
    required: true,
  },
});
const pageNodeSchema = new mongoose.Schema<NodeModelSchema>({
  type: {
    type: String,
    enum: ["base", "question", "choice"],
    required: true,
  },
  nodeId: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
    unique: true,
  },
  pages: {
    type: [pageSchema],
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
  question: {
    type: questionChoiceSchema,
  },
  choice: {
    type: questionChoiceSchema,
  },
  values: {
    type: [String],
  },
  feedback: {
    type: feedbackSchema,
  },
  nextSteps: {
    type: [Number],
  },
}).index({ nodeId: 1, label: 1 }, { unique: true });

pageNodeSchema.pre("save", function (next) {
  if (this.type !== "choice") {
    this.nextSteps = undefined;
  }
  if (this.type === "base") {
    this.values = undefined;
  }

  next();
});
pageNodeSchema.methods.toJSON = function () {
  const pageNode = this.toObject();

  delete pageNode._id;
  delete pageNode.__v;

  return pageNode;
};

const PageNodeModel = mongoose.model("PageNode", pageNodeSchema);

export default PageNodeModel;
