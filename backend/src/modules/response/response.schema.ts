import { z } from "zod";

export const submitResponseSchema = z.object({
  sessionToken: z.string().min(1).max(255).optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        optionId: z.string().uuid(),
      }),
    )
    .default([]),
});
