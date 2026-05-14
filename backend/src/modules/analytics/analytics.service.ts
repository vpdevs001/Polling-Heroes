import { and, count, eq, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { polls, responses } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import * as pollService from "../poll/poll.service.js";

export async function buildAnalyticsPayload(pollId: string) {
  const [poll] = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!poll) return null;

  const totalSubmissions = await pollService.countSubmissions(pollId);

  const qs = await pollService.getPollQuestionsAndOptions(pollId);

  const questionsOut = [];
  for (const q of qs) {
    const optionRows = [];
    let totalAnswers = 0;
    for (const o of q.options) {
      const [row] = await db
        .select({ c: count(responses.id) })
        .from(responses)
        .where(and(eq(responses.optionId, o.id), eq(responses.questionId, q.id)));
      const c = Number(row?.c ?? 0);
      totalAnswers += c;
      optionRows.push({ option: o, count: c });
    }
    const optionsOut = optionRows.map(({ option: o, count: cnt }) => ({
      id: o.id,
      text: o.text,
      count: cnt,
      percentage:
        totalAnswers === 0 ? 0 : Math.round((cnt / totalAnswers) * 1000) / 10,
    }));

    questionsOut.push({
      id: q.id,
      text: q.text,
      isRequired: q.isRequired,
      totalAnswers,
      options: optionsOut,
    });
  }

  const timelineResult = await db.execute(sql`
    select date_trunc('hour', created_at) as date,
           count(*)::int as count
    from submissions
    where poll_id = ${pollId}
    group by 1
    order by 1 asc
  `);

  const timelineRows = timelineResult.rows as unknown as {
    date: Date | string;
    count: number | string;
  }[];

  const timeline = timelineRows.map((r) => ({
    date: new Date(r.date).toISOString(),
    count: Number(r.count),
  }));

  const uniqueRespondersResult = await db.execute(sql`
    select count(distinct coalesce(user_id::text, session_token))::int as c
    from submissions
    where poll_id = ${pollId}
  `);

  const urRows = uniqueRespondersResult.rows as unknown as { c: number | string }[];
  const uniqueResponders = Number(urRows[0]?.c ?? 0);

  return {
    poll: {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      isPublished: poll.isPublished,
      participantType: poll.participantType,
      expiresAt: poll.expiresAt,
      totalSubmissions,
      uniqueResponders,
    },
    questions: questionsOut,
    timeline,
  };
}

export async function getAnalyticsForCreator(pollId: string, hostId: string) {
  await pollService.assertPollOwned(pollId, hostId);
  const payload = await buildAnalyticsPayload(pollId);
  if (!payload) throw ApiError.notFound("Poll not found");
  return payload;
}

export async function getPublicResultsBySlug(slug: string) {
  const poll = await pollService.getPollBySlugPublic(slug);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (!poll.isPublished) {
    throw ApiError.forbidden("Results are not published yet");
  }
  return buildAnalyticsPayload(poll.id);
}
