import { and, eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { responses, submissions } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import * as pollService from "../poll/poll.service.js";
import { emitResponseNew } from "../socket/socket.js";
import type { z } from "zod";
import type { submitResponseSchema } from "./response.schema.js";

type SubmitBody = z.infer<typeof submitResponseSchema>;

type RequestUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null;

export async function submitResponses(slug: string, body: SubmitBody, user: RequestUser) {
  const pollRow = await pollService.getPollBySlugPublic(slug);
  if (!pollRow) {
    throw ApiError.notFound("Poll not found");
  }

  if (pollRow.participantType === "Authenticated") {
    if (!user) {
      throw ApiError.unauthorized("This poll requires authentication");
    }
  }

  const sessionToken = body.sessionToken?.trim();
  if (pollRow.participantType === "Anonymous") {
    if (!sessionToken) {
      throw ApiError.badRequest("sessionToken is required for anonymous polls");
    }
  }

  if (pollRow.status !== "Active") {
    throw ApiError.gone("This poll is no longer accepting responses");
  }

  const dupConditions =
    pollRow.participantType === "Authenticated" && user
      ? and(eq(submissions.pollId, pollRow.id), eq(submissions.userId, user.id))
      : and(eq(submissions.pollId, pollRow.id), eq(submissions.sessionToken, sessionToken!));

  const [existing] = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(dupConditions)
    .limit(1);

  if (existing) {
    throw ApiError.badRequest("You have already responded to this poll");
  }

  const qs = await pollService.getPollQuestionsAndOptions(pollRow.id);
  if (qs.length > 0 && body.answers.length === 0) {
    throw ApiError.badRequest("At least one answer is required");
  }

  const questionById = new Map(qs.map((q) => [q.id, q]));
  const answersByQuestion = new Map<string, string>();
  for (const a of body.answers) {
    if (!questionById.has(a.questionId)) {
      throw ApiError.badRequest("Unknown question in submission");
    }
    answersByQuestion.set(a.questionId, a.optionId);
  }

  for (const q of qs) {
    if (!q.isRequired) continue;
    if (!answersByQuestion.has(q.id)) {
      throw ApiError.badRequest(`Missing answer for required question: ${q.text.slice(0, 80)}`);
    }
  }

  for (const [qid, oid] of answersByQuestion) {
    const q = questionById.get(qid);
    if (!q || q.pollId !== pollRow.id) {
      throw ApiError.badRequest("Invalid question for this poll");
    }
    const opt = q.options.find((o) => o.id === oid);
    if (!opt) {
      throw ApiError.badRequest("Invalid option for this question");
    }
  }

  const submission = await db.transaction(async (tx) => {
    const [sub] = await tx
      .insert(submissions)
      .values({
        pollId: pollRow.id,
        userId: pollRow.participantType === "Authenticated" && user ? user.id : null,
        sessionToken:
          pollRow.participantType === "Anonymous" ? sessionToken ?? null : null,
      })
      .returning();

    for (const [questionId, optionId] of answersByQuestion) {
      await tx.insert(responses).values({
        pollId: pollRow.id,
        submissionId: sub.id,
        questionId,
        optionId,
      });
    }
    return sub;
  });

  const total = await pollService.countSubmissions(pollRow.id);
  emitResponseNew(pollRow.id, total);

  return { submissionId: submission.id, totalSubmissions: total };
}
