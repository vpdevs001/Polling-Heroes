import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

type JwtUserPayload = {
  sub: string;
};

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw ApiError.internal("JWT_SECRET is not configured");
  }
  return secret;
};

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken as string | undefined;
    if (!token) {
      throw ApiError.unauthorized();
    }
    try {
      const decoded = jwt.verify(token, getSecret()) as JwtUserPayload;
      const userId = decoded.sub;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw ApiError.unauthorized("User no longer exists");
      }

      req.user = user;
      next();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw ApiError.unauthorized("Invalid or expired token");
    }
  },
);

export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.user = null;
    const token = req.cookies?.accessToken as string | undefined;
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(token, getSecret()) as JwtUserPayload;
      const userId = decoded.sub;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (user) {
        req.user = user;
      }
    } catch {
      req.user = null;
    }
    next();
  },
);
