import {
  MAX_CONTINUE_OPTION_LENGTH,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_CHOICE_TEXT_LENGTH,
  MAX_TEXT_CONTENT_LENGTH,
  MAX_VALUE_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../constants";

import { z } from "zod";

const baseSchema = z.object({
  type: z.literal("base"),
  id: z.string({ message: "Id required" }),
  label: z.string().min(1, { message: "Label required" }),
  pages: z
    .array(
      z.object({
        background: z.string(),
        text: z.object({
          content: z
            .string()
            .min(1, { message: "Page content required" })
            .max(MAX_TEXT_CONTENT_LENGTH, {
              message: "Page content too long",
            }),
          position: z.custom<PageTextPosition>(),
          class: z.string().default("").optional(),
        }),
      })
    )
    .min(2)
    .max(2),
  audio: z.string(),
  position: z.object({
    x: z.string(),
    y: z.string(),
  }),
});
const questionSchema = z.object({
  type: z.literal("question"),
  id: z.string({ message: "Id required" }),
  label: z.string().min(1, { message: "Label required" }),
  pages: z
    .array(
      z.object({
        background: z.string(),
        text: z.object({
          content: z
            .string()
            .min(1, { message: "Page content required" })
            .max(MAX_TEXT_CONTENT_LENGTH, {
              message: "Page content too long",
            }),
          position: z.custom<PageTextPosition>(),
          class: z.string().default("").optional(),
        }),
      })
    )
    .min(2)
    .max(2),
  audio: z.string(),
  question: z.object({
    text: z
      .string()
      .min(1, { message: "Question text required" })
      .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
        message: "Question text too long",
      }),
    audio: z.array(z.string()).min(3).max(3),
    options: z
      .array(
        z.string().min(1, { message: "Option text required" }).max(MAX_OPTION_LENGTH, {
          message: "Option text too long",
        })
      )
      .min(2)
      .max(2),
  }),
  values: z
    .array(
      z.string().min(1, "Value text required").max(MAX_VALUE_LENGTH, {
        message: "Value text too long",
      })
    )
    .min(2)
    .max(2),
  feedback: z.object({
    list: z
      .array(
        z.object({
          text: z.string().min(1, "Feedback text required"),
          audio: z.string(),
        })
      )
      .min(2)
      .max(2),
    option: z.string().min(1, "Option text required").max(MAX_CONTINUE_OPTION_LENGTH, {
      message: "Option text too long",
    }),
  }),
  position: z.object({
    x: z.string(),
    y: z.string(),
  }),
});
const choiceSchema = z.object({
  type: z.literal("choice"),
  id: z.string({ message: "Id required" }),
  label: z.string().min(1, { message: "Label required" }),
  pages: z
    .array(
      z.object({
        background: z.string(),
        text: z.object({
          content: z
            .string()
            .min(1, { message: "Page content required" })
            .max(MAX_TEXT_CONTENT_LENGTH, {
              message: "Page content too long",
            }),
          position: z.custom<PageTextPosition>(),
          class: z.string().default("").optional(),
        }),
      })
    )
    .min(2)
    .max(2),
  audio: z.string(),
  choice: z.object({
    text: z
      .string()
      .min(1, { message: "Choice text required" })
      .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
        message: "Choice text too long",
      }),
    audio: z.array(z.string()).min(3).max(3),
    options: z
      .array(
        z.string().min(1, { message: "Option text required" }).max(MAX_OPTION_LENGTH, {
          message: "Option text too long",
        })
      )
      .min(2)
      .max(2),
  }),
  values: z
    .array(
      z.string().min(1, "Value text required").max(MAX_VALUE_LENGTH, {
        message: "Value text too long",
      })
    )
    .min(2)
    .max(2),
  feedback: z.object({
    list: z
      .array(
        z.object({
          text: z.string().min(1, "Feedback text required"),
          audio: z.string(),
        })
      )
      .min(2)
      .max(2),
    option: z.string().min(1, "Option text required").max(MAX_CONTINUE_OPTION_LENGTH, {
      message: "Option text too long",
    }),
  }),
  nextSteps: z.array(z.number().int().positive()).min(2).max(2).optional(),
  position: z.object({
    x: z.string(),
    y: z.string(),
  }),
});

export const nodeSchema = baseSchema.or(questionSchema).or(choiceSchema);
export const edgeSchema = z.object({
  id: z.string({ message: "Id required" }),
  source: z.string({ message: "Source id required" }),
  target: z.string({ message: "Target id required" }),
});
export const flowSchema = z.object({
  nodes: z.array(nodeSchema).min(1),
  edges: z.array(edgeSchema),
});
export type NodeSchema = z.infer<typeof nodeSchema>;
export type EdgeSchema = z.infer<typeof edgeSchema>;
export type FlowSchema = z.infer<typeof flowSchema>;

export const userSchema = z.object({
  username: z
    .string()
    .min(
      MIN_USERNAME_LENGTH,
      `L'username dev'essere di almeno ${MIN_USERNAME_LENGTH} caratteri`
    ),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `La password dev'essere di minimo ${MIN_PASSWORD_LENGTH} caratteri`
    ),
});
export type UserSchema = z.infer<typeof userSchema>;
