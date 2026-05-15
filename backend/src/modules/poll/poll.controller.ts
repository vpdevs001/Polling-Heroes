import { Request, Response } from "express";
import { paramString } from "../../common/utils/routeParams.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import * as pollService from "./poll.service.js";

export const createPoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  if (!req.user.isVerified) {
    throw ApiError.forbidden("You must verify your email address before creating polls.");
  }
  const poll = await pollService.createPoll(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, { poll }, "Poll created"));
});

export const listPolls = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const items = await pollService.getPollsByHost(req.user.id);
  return res.status(200).json(new ApiResponse(200, { polls: items }, "OK"));
});

export const getPublicPoll = asyncHandler(async (req: Request, res: Response) => {
  const slug = paramString(req.params.slug);
  const poll = await pollService.getPollBySlugPublic(slug);
  if (!poll) throw ApiError.notFound("Poll not found");
  const questions = await pollService.getPollQuestionsAndOptions(poll.id);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        poll: {
          id: poll.id,
          title: poll.title,
          description: poll.description,
          participantType: poll.participantType,
          status: poll.status,
          isPublished: poll.isPublished,
          expiresAt: poll.expiresAt,
          url: poll.url,
        },
        questions,
      },
      "OK",
    ),
  );
});

export const getPollById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const pollId = paramString(req.params.pollId);
  const poll = await pollService.getPollByIdForHost(pollId, req.user.id);
  if (!poll) throw ApiError.notFound("Poll not found");
  const questions = await pollService.getPollQuestionsAndOptions(poll.id);
  return res.status(200).json(new ApiResponse(200, { poll, questions }, "OK"));
});

export const updatePoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const pollId = paramString(req.params.pollId);
  const poll = await pollService.updatePoll(pollId, req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, { poll }, "Updated"));
});

export const endPoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const pollId = paramString(req.params.pollId);
  const poll = await pollService.endPoll(pollId, req.user.id);
  return res.status(200).json(new ApiResponse(200, { poll }, "Poll ended"));
});

export const publishPoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const pollId = paramString(req.params.pollId);
  const poll = await pollService.publishPoll(pollId, req.user.id);
  return res.status(200).json(new ApiResponse(200, { poll }, "Results published"));
});

export const deletePoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const pollId = paramString(req.params.pollId);
  await pollService.deletePoll(pollId, req.user.id);
  return res.status(200).json(new ApiResponse(200, { message: "Deleted" }, "OK"));
});
