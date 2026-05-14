import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requirePollUuidParam(req: Request, _res: Response, next: NextFunction) {
  const raw = req.params.pollId;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || !UUID_RE.test(id)) {
    throw ApiError.badRequest("Invalid poll id");
  }
  next();
}
