import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerFormSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const optionSchema = z.object({
  text: z.string().min(1),
  order: z.number().int(),
});

const questionSchema = z.object({
  text: z.string().min(1),
  isRequired: z.boolean(),
  order: z.number().int(),
  options: z.array(optionSchema).min(2),
});

export const createPollFormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  participantType: z.enum(["Authenticated", "Anonymous"]),
  expiresAt: z.string().optional(),
  questions: z.array(questionSchema).min(1),
});
