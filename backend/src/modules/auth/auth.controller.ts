import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { accessTokenCookieOptions } from "../../common/utils/cookieOptions.js";
import * as authService from "./auth.service.js";

const ACCESS_COOKIE = "accessToken";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(ACCESS_COOKIE, token, accessTokenCookieOptions);
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  if ("error" in result && result.error === "EMAIL_TAKEN") {
    throw ApiError.badRequest("Email is already registered");
  }

  if ("token" in result) {
    setAuthCookie(res, result.token);
  }
  
  return res.status(201).json(
    new ApiResponse(201, { user: result.user }, "Registration successful."),
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  if ("error" in result) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  setAuthCookie(res, result.token);
  return res.status(200).json(new ApiResponse(200, { user: result.user }, "Logged in"));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    throw ApiError.badRequest("Verification token is required");
  }

  const result = await authService.verifyEmailToken(token);
  if ("error" in result) {
    if (result.error === "INVALID_TOKEN") {
      throw ApiError.badRequest("Invalid verification token");
    }
    if (result.error === "TOKEN_EXPIRED") {
      throw ApiError.badRequest("Verification token has expired");
    }
    throw ApiError.internal();
  }

  return res.status(200).json(new ApiResponse(200, null, "Email verified successfully"));
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw ApiError.badRequest("Email is required");
  }

  const result = await authService.resendVerificationToken(email);
  if ("error" in result) {
    if (result.error === "USER_NOT_FOUND") {
      throw ApiError.notFound("User with this email does not exist");
    }
    if (result.error === "ALREADY_VERIFIED") {
      throw ApiError.badRequest("Email is already verified");
    }
    throw ApiError.internal();
  }

  return res.status(200).json(new ApiResponse(200, null, "Verification email resent successfully"));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(ACCESS_COOKIE, { path: accessTokenCookieOptions.path });
  return res.status(200).json(new ApiResponse(200, { message: "Logged out" }, "OK"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  const user = await authService.findUserById(req.user.id);
  if (!user) {
    throw ApiError.unauthorized();
  }
  return res.status(200).json(new ApiResponse(200, { user }, "OK"));
});
