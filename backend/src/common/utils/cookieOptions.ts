import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
