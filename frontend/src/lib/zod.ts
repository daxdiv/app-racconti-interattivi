import {
  MAX_CONTINUE_OPTION_LENGTH,
  MAX_FILE_SIZE,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_CHOICE_TEXT_LENGTH,
  MAX_TEXT_CONTENT_LENGTH,
  MAX_VALUE_LENGTH,
} from "@/constants";

import { z } from "zod";

export const pageSchema = z.object({
  type: z.enum(["base", "question", "choice"]),
  label: z.string().min(1, { message: "Il titolo non può essere vuoto" }),
  pages: z
    .array(
      z.object({
        text: z.object({
          content: z
            .string()
            .min(1, { message: "Il contenuto non può essere vuoto" })
            .max(MAX_TEXT_CONTENT_LENGTH, {
              message: `Il contenuto può essere al massimo di ${MAX_TEXT_CONTENT_LENGTH} caratteri`,
            })
            .default(""),
          position: z.custom<PageTextPosition>(),
          class: z.string().default("").optional(),
        }),
      })
    )
    .min(2)
    .max(2),
  background: z
    .instanceof(File)
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url()),
  audio: z
    .instanceof(File)
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url()),
  question: z
    .object({
      text: z
        .string()
        .min(1, { message: "Il testo di una domanda non può essere vuoto" })
        .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
          message: `Il testo di una domanda può essere al massimo ${MAX_QUESTION_CHOICE_TEXT_LENGTH} caratteri`,
        })
        .default(""),
      audio: z
        .array(
          z
            .instanceof(File)
            .refine(file => file.size > 0, "Inserire un file")
            .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
            .or(z.string().url())
        )
        .min(3)
        .max(3),
      options: z
        .array(
          z
            .string()
            .min(1, { message: "L'opzione non può essere vuota" })
            .max(MAX_OPTION_LENGTH, {
              message: `L'opzione può essere al massimo ${MAX_OPTION_LENGTH} caratteri`,
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
        .min(1, { message: "Il testo di una scelta non può essere vuoto" })
        .max(MAX_QUESTION_CHOICE_TEXT_LENGTH, {
          message: `Il testo di una scelta può essere al massimo ${MAX_QUESTION_CHOICE_TEXT_LENGTH} caratteri`,
        })
        .default(""),
      audio: z
        .array(
          z
            .instanceof(File)
            .refine(file => file.size > 0, "Inserire un file")
            .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
            .or(z.string().url())
        )
        .max(3),
      options: z
        .array(
          z
            .string()
            .min(1, { message: "L'opzione non può essere vuota" })
            .max(MAX_OPTION_LENGTH, {
              message: `L'opzione può essere al massimo ${MAX_OPTION_LENGTH} caratteri`,
            })
            .default("")
        )
        .min(2)
        .max(2),
    })
    .optional(),
  values: z
    .array(
      z
        .string()
        .min(1, "Il valore non può essere vuoto")
        .max(MAX_VALUE_LENGTH, {
          message: `Il valore può essere al massimo ${MAX_VALUE_LENGTH} caratteri`,
        })
        .default("")
    )
    // .min(2)
    // .max(2)
    .optional(),
  feedback: z
    .object({
      list: z
        .array(
          z.object({
            text: z.string().min(1, "Il feedback non può essere vuoto"),
            audio: z
              .instanceof(File)
              .refine(file => file.size > 0, "Inserire un file")
              .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
              .or(z.string().url()),
          })
        )
        .min(2)
        .max(2),
      option: z
        .string()
        .min(1, "L'opzione non può essere vuota")
        .max(MAX_CONTINUE_OPTION_LENGTH, {
          message: `L'opzione per continuare può essere al massimo ${MAX_CONTINUE_OPTION_LENGTH} caratteri`,
        })
        .default(""),
    })
    .optional(),
});
export type PageSchema = z.infer<typeof pageSchema>;
