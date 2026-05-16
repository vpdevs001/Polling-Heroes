import { Request, Response } from "express";
import { paramString } from "../../common/utils/routeParams.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import * as responseService from "./response.service.js";

export const postSubmitResponses = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = paramString(req.params.slug);
    const result = await responseService.submitResponses(
      slug,
      req.body,
      req.user ?? null,
    );
    return res
      .status(201)
      .json(new ApiResponse(201, result, "Response recorded"));
  },
);
