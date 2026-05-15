import { Router } from "express";
import { requireAuth } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import * as ctrl from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);
router.post("/logout", requireAuth, ctrl.logout);
router.get("/me", requireAuth, ctrl.getMe);
router.get("/verify-email", ctrl.verifyEmail);
router.post("/resend-verification", ctrl.resendVerification);

export default router;
