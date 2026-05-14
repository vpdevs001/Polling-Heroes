import api from "./axios.js";
import type { ApiEnvelope } from "../types/index.js";

export async function submitResponse(
  slug: string,
  body: { sessionToken?: string; answers: unknown },
) {
  const { data } = await api.post<ApiEnvelope<{ submissionId: string; totalSubmissions: number }>>(
    `/polls/${slug}/respond`,
    body,
  );
  return data;
}
