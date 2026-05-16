import api from "./axios.js";
import type { AnalyticsPayload, ApiEnvelope } from "../types/index.js";

export async function getAnalytics(pollId: string) {
  const { data } = await api.get<ApiEnvelope<AnalyticsPayload>>(
    `/polls/${pollId}/analytics`,
  );
  return data;
}

export async function getPublicResults(slug: string) {
  const { data } = await api.get<ApiEnvelope<AnalyticsPayload>>(
    `/polls/public/${slug}/results`,
  );
  return data;
}
