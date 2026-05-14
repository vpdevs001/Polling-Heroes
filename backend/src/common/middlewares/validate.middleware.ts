import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest("Validation failed", [parsed.error.flatten()]);
    }
    req.body = parsed.data;
    next();
  };
