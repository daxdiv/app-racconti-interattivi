import {
  MAX_CONTINUE_OPTION_LENGTH,
  MAX_FILE_SIZE,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_CHOICE_TEXT_LENGTH,
  MAX_TEXT_CONTENT_LENGTH,
  MAX_VALUE_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants";

import { z } from "zod";

const baseSchema = z.object({
  type: z.literal("base"),
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
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
  audio: z
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
});
const questionSchema = z.object({
  type: z.literal("question"),
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
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
  audio: z
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
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
            .instanceof(File, { message: "Inserire un file" })
            .refine(file => file.size > 0, "Inserire un file")
            .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
            .or(z.string().url({ message: "Inserire un file" }))
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
    .min(2)
    .max(2)
    .optional(),
  feedback: z
    .object({
      list: z
        .array(
          z.object({
            text: z.string().min(1, "Il feedback non può essere vuoto"),
            audio: z
              .instanceof(File, { message: "Inserire un file" })
              .refine(file => file.size > 0, "Inserire un file")
              .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
              .or(z.string().url({ message: "Inserire un file" })),
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
const choiceSchema = z.object({
  type: z.literal("choice"),
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
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
  audio: z
    .instanceof(File, { message: "Inserire un file" })
    .refine(file => file.size > 0, "Inserire un file")
    .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
    .or(z.string().url({ message: "Inserire un file" })),
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
            .instanceof(File, { message: "Inserire un file" })
            .refine(file => file.size > 0, "Inserire un file")
            .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
            .or(z.string().url({ message: "Inserire un file" }))
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
    .min(2)
    .max(2)
    .optional(),
  feedback: z
    .object({
      list: z
        .array(
          z.object({
            text: z.string().min(1, "Il feedback non può essere vuoto"),
            audio: z
              .instanceof(File, { message: "Inserire un file" })
              .refine(file => file.size > 0, "Inserire un file")
              .refine(file => file.size < MAX_FILE_SIZE, "File troppo grande")
              .or(z.string().url({ message: "Inserire un file" })),
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

export const pageSchema = baseSchema.or(questionSchema).or(choiceSchema);
export type PageSchema = z.infer<typeof pageSchema>;

const signUpSchema = z.object({
  type: z.literal("sign-up"),
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
const signInSchema = z.object({
  type: z.literal("sign-in"),
  username: z.string().min(1, "Inserire il nome utente"),
  password: z.string().min(1, "Inserire una password"),
});
export const authSchema = signUpSchema.or(signInSchema);
export type AuthSchema = z.infer<typeof authSchema>;

export const usernameSchema = z.object({
  username: z
    .string()
    .min(
      MIN_USERNAME_LENGTH,
      `L'username dev'essere di almeno ${MIN_USERNAME_LENGTH} caratteri`
    ),
});
export type UsernameSchema = z.infer<typeof usernameSchema>;
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `La password dev'essere di almeno ${MIN_PASSWORD_LENGTH} caratteri`
      ),
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `La password dev'essere di almeno ${MIN_PASSWORD_LENGTH} caratteri`
      ),
    confirmNewPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `La password dev'essere di almeno ${MIN_PASSWORD_LENGTH} caratteri`
      ),
  })
  .superRefine(({ password, newPassword, confirmNewPassword }, ctx) => {
    if (password === newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La password nuova non può essere quella vecchia",
        path: ["newPassword"],
      });
    }
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `"Nuova password" e "Conferma nuova password" devono combaciare`,
        path: ["confirmNewPassword"],
      });
    }
  });
export type PasswordSchema = z.infer<typeof passwordSchema>;
