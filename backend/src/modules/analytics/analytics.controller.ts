import { Request, Response } from "express";
import { paramString } from "../../common/utils/routeParams.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import * as analyticsService from "./analytics.service.js";

export const getPollAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const pollId = paramString(req.params.pollId);
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    const data = await analyticsService.getAnalyticsForCreator(
      pollId,
      req.user.id,
    );
    return res.status(200).json(new ApiResponse(200, data, "OK"));
  },
);

export const getPublicResults = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = paramString(req.params.slug);
    const data = await analyticsService.getPublicResultsBySlug(slug);
    return res.status(200).json(new ApiResponse(200, data, "OK"));
  },
);
