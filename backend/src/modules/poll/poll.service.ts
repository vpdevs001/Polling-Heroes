import { count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import {
  options,
  polls,
  questions,
  submissions,
} from "../../common/db/schema.js";
import { generateSlug } from "../../common/utils/generateSlug.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { emitPollEnded, emitPollPublished } from "../socket/socket.js";
import type { z } from "zod";
import type { createPollSchema, updatePollSchema } from "./poll.schema.js";

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;

export async function checkAndExpirePoll<T extends typeof polls.$inferSelect>(
  pollRow: T,
): Promise<T & { status: "Active" | "Ended" }> {
  if (pollRow.status !== "Active" || !pollRow.expiresAt) {
    return pollRow as T & { status: "Active" | "Ended" };
  }
  const now = new Date();
  if (pollRow.expiresAt.getTime() > now.getTime()) {
    return pollRow as T & { status: "Active" | "Ended" };
  }
  await db
    .update(polls)
    .set({ status: "Ended", updatedAt: now })
    .where(eq(polls.id, pollRow.id));
  emitPollEnded(pollRow.id);
  return { ...pollRow, status: "Ended", updatedAt: now };
}

async function ensureUniqueUrl(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const url = generateSlug();
    const [existing] = await db
      .select({ id: polls.id })
      .from(polls)
      .where(eq(polls.url, url))
      .limit(1);
    if (!existing) return url;
  }
  throw ApiError.internal("Could not allocate poll URL");
}

export async function createPoll(hostId: string, input: CreatePollInput) {
  const url = await ensureUniqueUrl();
  return db.transaction(async (tx) => {
    const [poll] = await tx
      .insert(polls)
      .values({
        hostId,
        title: input.title,
        description: input.description ?? null,
        url,
        participantType: input.participantType,
        status: "Active",
        isPublished: false,
        expiresAt: input.expiresAt ?? null,
      })
      .returning();

    if (!poll) {
      throw ApiError.internal("Failed to create poll");
    }

    for (const q of input.questions) {
      const [qRow] = await tx
        .insert(questions)
        .values({
          pollId: poll.id,
          text: q.text,
          isRequired: q.isRequired,
          order: q.order,
        })
        .returning();
      for (const o of q.options) {
        await tx.insert(options).values({
          questionId: qRow.id,
          text: o.text,
          order: o.order,
        });
      }
    }
    return poll;
  });
}

export async function getPollsByHost(hostId: string) {
  const rows = await db
    .select({
      ...getTableColumns(polls),
      submissionCount: sql<number>`coalesce((
        select count(*)::int from submissions s where s.poll_id = ${polls.id}
      ), 0)`,
    })
    .from(polls)
    .where(eq(polls.hostId, hostId))
    .orderBy(desc(polls.createdAt));

  return rows.map((r) => ({
    ...r,
    submissionCount: Number(r.submissionCount),
  }));
}

export async function getPollByIdForHost(pollId: string, hostId: string) {
  const [row] = await db
    .select()
    .from(polls)
    .where(eq(polls.id, pollId))
    .limit(1);
  if (!row) return null;
  if (row.hostId !== hostId) {
    throw ApiError.forbidden("You do not own this poll");
  }
  return checkAndExpirePoll(row);
}

export async function getPollBySlugPublic(slug: string) {
  const [row] = await db
    .select()
    .from(polls)
    .where(eq(polls.url, slug))
    .limit(1);
  if (!row) return null;
  return checkAndExpirePoll(row);
}

export async function getPollQuestionsAndOptions(pollId: string) {
  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.pollId, pollId))
    .orderBy(questions.order);
  const result = [];
  for (const q of qs) {
    const opts = await db
      .select()
      .from(options)
      .where(eq(options.questionId, q.id))
      .orderBy(options.order);
    result.push({ ...q, options: opts });
  }
  return result;
}

export async function updatePoll(
  pollId: string,
  hostId: string,
  input: UpdatePollInput,
) {
  const poll = await getPollByIdForHost(pollId, hostId);
  if (!poll) throw ApiError.notFound("Poll not found");

  const patch: Partial<typeof polls.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.expiresAt !== undefined) patch.expiresAt = input.expiresAt;
  if (input.participantType !== undefined)
    patch.participantType = input.participantType;

  const [updated] = await db
    .update(polls)
    .set(patch)
    .where(eq(polls.id, pollId))
    .returning();
  return checkAndExpirePoll(updated);
}

export async function endPoll(pollId: string, hostId: string) {
  const poll = await getPollByIdForHost(pollId, hostId);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (poll.status === "Ended") {
    return poll;
  }
  const [updated] = await db
    .update(polls)
    .set({ status: "Ended", updatedAt: new Date() })
    .where(eq(polls.id, pollId))
    .returning();
  emitPollEnded(pollId);
  return updated;
}

export async function publishPoll(pollId: string, hostId: string) {
  const poll = await getPollByIdForHost(pollId, hostId);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (poll.status !== "Ended") {
    throw ApiError.badRequest("Poll must be ended before publishing results");
  }
  const [updated] = await db
    .update(polls)
    .set({ isPublished: true, updatedAt: new Date() })
    .where(eq(polls.id, pollId))
    .returning();
  emitPollPublished(pollId);
  return updated;
}

export async function deletePoll(pollId: string, hostId: string) {
  const poll = await getPollByIdForHost(pollId, hostId);
  if (!poll) throw ApiError.notFound("Poll not found");
  await db.delete(polls).where(eq(polls.id, pollId));
}

export async function assertPollOwned(pollId: string, hostId: string) {
  const p = await getPollByIdForHost(pollId, hostId);
  if (!p) throw ApiError.notFound("Poll not found");
  return p;
}

export async function countSubmissions(pollId: string) {
  const [row] = await db
    .select({ c: count(submissions.id) })
    .from(submissions)
    .where(eq(submissions.pollId, pollId));
  return Number(row?.c ?? 0);
}
