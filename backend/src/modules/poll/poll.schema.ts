import { z } from "zod";

const optionInput = z.object({
  text: z.string().min(1).max(2000),
  order: z.number().int().min(0),
});

const questionInput = z.object({
  text: z.string().min(1).max(5000),
  isRequired: z.boolean().default(true),
  order: z.number().int().min(0),
  options: z.array(optionInput).min(2),
});

export const createPollSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional().nullable(),
  participantType: z.enum(["Authenticated", "Anonymous"]),
  expiresAt: z.coerce.date().nullable().optional(),
  questions: z.array(questionInput).min(1),
});

export const updatePollSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(10000).optional().nullable(),
  expiresAt: z.coerce.date().nullable().optional(),
  participantType: z.enum(["Authenticated", "Anonymous"]).optional(),
});
