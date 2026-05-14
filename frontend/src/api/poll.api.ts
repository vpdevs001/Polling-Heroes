import api from "./axios.js";
import type { ApiEnvelope, PollListItem, PublicPollPayload, Question } from "../types/index.js";

export async function createPoll(body: unknown) {
  const { data } = await api.post<ApiEnvelope<{ poll: { id: string; url: string } }>>(
    "/polls",
    body,
  );
  return data;
}

export async function getMyPolls() {
  const { data } = await api.get<ApiEnvelope<{ polls: PollListItem[] }>>("/polls");
  return data;
}

export async function getPoll(pollId: string) {
  const { data } = await api.get<ApiEnvelope<{ poll: PollListItem; questions: Question[] }>>(
    `/polls/${pollId}`,
  );
  return data;
}

export async function getPublicPoll(slug: string) {
  const { data } = await api.get<ApiEnvelope<PublicPollPayload>>(`/polls/public/${slug}`);
  return data;
}

export async function updatePoll(pollId: string, body: unknown) {
  const { data } = await api.patch<ApiEnvelope<{ poll: PollListItem }>>(`/polls/${pollId}`, body);
  return data;
}

export async function endPoll(pollId: string) {
  const { data } = await api.patch<ApiEnvelope<{ poll: PollListItem }>>(`/polls/${pollId}/end`);
  return data;
}

export async function publishPoll(pollId: string) {
  const { data } = await api.patch<ApiEnvelope<{ poll: PollListItem }>>(
    `/polls/${pollId}/publish`,
  );
  return data;
}

export async function deletePoll(pollId: string) {
  const { data } = await api.delete<ApiEnvelope<{ message: string }>>(`/polls/${pollId}`);
  return data;
}
