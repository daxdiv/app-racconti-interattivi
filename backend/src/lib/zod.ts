import {
  MAX_CONTINUE_OPTION_LENGTH,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_CHOICE_TEXT_LENGTH,
  MAX_TEXT_CONTENT_LENGTH,
  MAX_VALUE_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../constants";

import mongoose from "mongoose";
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
  lastPage: z.literal(true).optional(),
  evaluation: z
    .object({
      show: z.literal(true),
      label: z.literal("Quanto ti è piaciuta la storia?"),
    })
    .optional(),
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
export const postFlowSchema = z.object({
  userId: z.custom<mongoose.Schema.Types.ObjectId>(
    data => mongoose.isValidObjectId(data),
    { message: "Invalid ObjectId" }
  ),
  label: z.string().min(1),
  nodes: z.array(nodeSchema).min(1),
  edges: z.array(edgeSchema),
});
export const putFlowSchema = z.object({
  userId: z.custom<mongoose.Schema.Types.ObjectId>(
    data => mongoose.isValidObjectId(data),
    { message: "Invalid ObjectId" }
  ),
  nodes: z.array(nodeSchema).min(1),
  edges: z.array(edgeSchema),
});
export const deleteFlowSchema = z.object({
  flowId: z.custom<mongoose.Schema.Types.ObjectId>(
    data => mongoose.isValidObjectId(data),
    { message: "Invalid ObjectId" }
  ),
});
export type NodeSchema = z.infer<typeof nodeSchema>;
export type EdgeSchema = z.infer<typeof edgeSchema>;
export type PostFlowSchema = z.infer<typeof postFlowSchema>;
export type PutFlowSchema = z.infer<typeof putFlowSchema>;

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
  })
  .superRefine(({ password, newPassword }, ctx) => {
    if (password === newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La password nuova non può essere quella vecchia",
        path: ["newPassword"],
      });
    }
  });
export type PasswordSchema = z.infer<typeof passwordSchema>;
