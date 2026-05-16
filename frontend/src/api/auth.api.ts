import api from "./axios.js";
import type { ApiEnvelope, AuthUser } from "../types/index.js";

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post<ApiEnvelope<{ user: AuthUser }>>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<ApiEnvelope<{ user: AuthUser }>>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function logout() {
  const { data } =
    await api.post<ApiEnvelope<{ message: string }>>("/auth/logout");
  return data;
}

export async function getMe() {
  const { data } = await api.get<ApiEnvelope<{ user: AuthUser }>>("/auth/me");
  return data;
}
