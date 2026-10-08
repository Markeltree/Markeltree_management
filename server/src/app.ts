import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./lib/http.js";
import { invalidateOnWrite } from "./lib/invalidate.js";
import { requireAuth } from "./middleware/auth.js";
import { authRouter } from "./modules/auth.js";
import { employeesRouter, orgRouter } from "./modules/employees.js";
import { attendanceRouter } from "./modules/attendance.js";
import { leaveRouter } from "./modules/leave.js";
import { tasksRouter } from "./modules/tasks.js";
import { projectsRouter } from "./modules/projects.js";
import { notificationsRouter } from "./modules/notifications.js";
import { announcementsRouter } from "./modules/announcements.js";
import { adminRouter } from "./modules/admin.js";
import { dashboardRouter } from "./modules/dashboard.js";
import { chatRouter } from "./modules/chat.js";
import { payrollRouter } from "./modules/payroll.js";
import { realtimeConfig } from "./lib/realtime.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api", rateLimit({ windowMs: 60_000, limit: 600, standardHeaders: "draft-8", legacyHeaders: false }));

  app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  app.use("/api/auth", authRouter);

  // Everything below requires an authenticated, active session.
  const api = express.Router();
  api.use(requireAuth);
  api.use(invalidateOnWrite);
  api.use("/dashboard", dashboardRouter);
  api.use("/employees", employeesRouter);
  api.use("/org", orgRouter);
  api.use("/attendance", attendanceRouter);
  api.use("/leave", leaveRouter);
  api.use("/tasks", tasksRouter);
  api.use("/projects", projectsRouter);
  api.use("/notifications", notificationsRouter);
  api.use("/announcements", announcementsRouter);
  api.use("/admin", adminRouter);
  api.use("/chat", chatRouter);
  api.use("/payroll", payrollRouter);
  api.get("/realtime/config", (req, res) => res.json(realtimeConfig(req.auth!.userId)));
  app.use("/api", api);

  app.use("/api", (_req, _res, next) => next(notFound("Endpoint")));
  app.use(errorHandler);
  return app;
}
