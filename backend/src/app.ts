import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import morgan from "morgan";
import { ApiResponse } from "./common/utils/ApiResponse.js";

import {
  errorHandler,
  routeNotFound,
} from "./common/middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import pollRoutes from "./modules/poll/poll.routes.js";

const app = express();

// Middlewares
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN ?? true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Health Check
app.get("/health", (_, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { status: "OK" }, "Server is healthy"));
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/polls", pollRoutes);

// 404 Handler
app.use(routeNotFound);

// Error Handler
app.use(errorHandler);

export default app;
