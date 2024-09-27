import {
  MAX_CONTINUE_OPTION_LENGTH,
  MAX_FILE_SIZE,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_CHOICE_TEXT_LENGTH,
  MAX_TEXT_CONTENT_LENGTH,
  MAX_VALUE_LENGTH,
} from "../constants";

import { z } from "zod";

export const pageNodeSchema = z.object({
  type: z.enum(["base", "question", "choice"]),
  label: z.string().min(1, { message: "Il titolo non può essere vuoto" }),
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
            })
            .default(""),
          position: z.custom<PageTextPosition>(),
          class: z.string().default("").optional(),
        }),
      })
    )
    .min(2)
    .max(2),
  audio: z.string(),
  question: z
    .object({
      text: z
        .string()
        .min(1, { message: "Question text required" })
        .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
          message: "Question text too long",
        })
        .default(""),
      audio: z
        .array(
          z
            .instanceof(File)
            .refine(file => file.size > 0, "File required")
            .refine(file => file.size < MAX_FILE_SIZE, "File too big")
        )
        .min(3)
        .max(3),
      options: z
        .array(
          z
            .string()
            .min(1, { message: "Option text required" })
            .max(MAX_OPTION_LENGTH, {
              message: "Option text too long",
            })
            .default("")
        )
        .min(2)
        .max(2),
    })
    .optional(),
  choice: z
    .object({
      text: z
        .string()
        .min(1, { message: "Choice text required" })
        .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
          message: "Choice text too long",
        })
        .default(""),
      audio: z.array(z.string()).max(3),
      options: z
        .array(
          z
            .string()
            .min(1, { message: "Option text required" })
            .max(MAX_OPTION_LENGTH, {
              message: "Option text too long",
            })
            .default("")
        )
        .min(2)
        .max(2),
    })
    .optional(),
  values: z
    .array(
      z.string().min(1, "Value text required").max(MAX_VALUE_LENGTH, {
        message: "Value text too long",
      })
    )
    .min(2)
    .max(2)
    .optional(),
  feedback: z
    .object({
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
    })
    .optional(),
  nextSteps: z.array(z.number().int().positive()).min(2).max(2).optional(),
});
export type PageNodeSchema = z.infer<typeof pageNodeSchema>;
