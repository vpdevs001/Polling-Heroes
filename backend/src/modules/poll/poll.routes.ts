import { Router } from "express";
import {
  optionalAuth,
  requireAuth,
} from "../../common/middlewares/auth.middleware.js";
import { requirePollUuidParam } from "../../common/middlewares/pollId.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import * as analyticsCtrl from "../analytics/analytics.controller.js";
import * as pollCtrl from "./poll.controller.js";
import { createPollSchema, updatePollSchema } from "./poll.schema.js";
import * as responseCtrl from "../response/response.controller.js";
import { submitResponseSchema } from "../response/response.schema.js";

const router = Router();

router.get("/public/:slug", pollCtrl.getPublicPoll);
router.get("/public/:slug/results", analyticsCtrl.getPublicResults);

router.post(
  "/:slug/respond",
  optionalAuth,
  validate(submitResponseSchema),
  responseCtrl.postSubmitResponses,
);

router.use(requireAuth);

router.post("/", validate(createPollSchema), pollCtrl.createPoll);
router.get("/", pollCtrl.listPolls);

router.get("/:pollId", requirePollUuidParam, pollCtrl.getPollById);
router.patch(
  "/:pollId",
  requirePollUuidParam,
  validate(updatePollSchema),
  pollCtrl.updatePoll,
);
router.patch("/:pollId/end", requirePollUuidParam, pollCtrl.endPoll);
router.patch("/:pollId/publish", requirePollUuidParam, pollCtrl.publishPoll);
router.delete("/:pollId", requirePollUuidParam, pollCtrl.deletePoll);
router.get(
  "/:pollId/analytics",
  requirePollUuidParam,
  analyticsCtrl.getPollAnalytics,
);

export default router;
