import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, parse, unauthorized } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { invalidate, invalidateKey, TAGS } from "../lib/cache.js";
import { loadAuthContext, requireAuth, signAccessToken } from "../middleware/auth.js";

export const authRouter = Router();

const REFRESH_COOKIE = "cfr_rt";
const RESET_CODE_TTL_MIN = 15;
const RESET_MAX_ATTEMPTS = 5;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

// Real hash used when the email is unknown, so failed logins take the same time.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");
export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip ?? "")}:${String(req.body?.email ?? "").toLowerCase()}`,
  message: { error: { message: "Too many login attempts. Try again in 15 minutes.", code: "RATE_LIMITED" } },
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { message: "Too many requests. Try again later.", code: "RATE_LIMITED" } },
});

function setRefreshCookie(res: Response, token: string, expires: Date) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: "/api/auth",
    expires,
  });
}

async function createSession(req: Request, res: Response, userId: string) {
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400_000);
  const session = await prisma.session.create({
    data: {
      userId,
      refreshTokenHash: sha256(refreshToken),
      expiresAt,
      ip: req.ip,
      userAgent: req.headers["user-agent"]?.slice(0, 300),
    },
  });
  setRefreshCookie(res, refreshToken, expiresAt);
  return { session, accessToken: signAccessToken(userId, session.id) };
}

/** Current user's profile + permissions, as consumed by the frontend AuthContext. */
export async function buildMe(userId: string, permissions: Set<string>) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      status: true,
      lastLoginAt: true,
      role: { select: { id: true, name: true } },
      employee: {
        select: {
          id: true,
          employeeCode: true,
          firstName: true,
          lastName: true,
          designation: true,
          avatarUrl: true,
          department: { select: { id: true, name: true } },
          manager: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });
  return { ...user, permissions: [...permissions].sort() };
}

authRouter.post(
  "/login",
  loginLimiter,
  ah(async (req, res) => {
    const body = parse(z.object({ email: z.string().email(), password: z.string().min(1) }), req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    // Compare against a dummy hash when the user doesn't exist to keep timing uniform.
    const ok = await bcrypt.compare(body.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !user.passwordHash || !ok) {
      await audit(req, "auth.login_failed", "User", user?.id, { email: body.email });
      throw unauthorized("Invalid email or password");
    }
    if (user.status !== "ACTIVE") {
      await audit(req, "auth.login_blocked", "User", user.id, { status: user.status }, user.id);
      throw unauthorized(
        user.status === "INVITED"
          ? "Your account has not been activated yet. Use 'Forgot password' to set a password."
          : "Your account is not active. Contact HR or an administrator.",
      );
    }
    const { session, accessToken } = await createSession(req, res, user.id);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await audit(req, "auth.login", "User", user.id, undefined, user.id);
    const ctx = await loadAuthContext(user.id, session.id);
    res.json({ accessToken, user: await buildMe(user.id, ctx!.permissions) });
  }),
);

authRouter.post(
  "/refresh",
  ah(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw unauthorized("No session");
    const session = await prisma.session.findUnique({ where: { refreshTokenHash: sha256(token) } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
      throw unauthorized("Session expired");
    }
    // Rotate: revoke the old session and issue a new one.
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    invalidateKey(`auth:${session.id}`);
    const { session: next, accessToken } = await createSession(req, res, session.userId);
    const ctx = await loadAuthContext(session.userId, next.id);
    if (!ctx) throw unauthorized("Account is not active");
    res.json({ accessToken, user: await buildMe(session.userId, ctx.permissions) });
  }),
);

authRouter.post(
  "/logout",
  ah(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) {
      const session = await prisma.session.findUnique({ where: { refreshTokenHash: sha256(token) }, select: { id: true } });
      if (session) {
        await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
        invalidateKey(`auth:${session.id}`);
      }
    }
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    res.json({ ok: true });
  }),
);

authRouter.post(
  "/logout-all",
  requireAuth,
  ah(async (req, res) => {
    await prisma.session.updateMany({ where: { userId: req.auth!.userId, revokedAt: null }, data: { revokedAt: new Date() } });
    invalidate(TAGS.user(req.auth!.userId));
    await audit(req, "auth.logout_all", "User", req.auth!.userId);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    res.json({ ok: true });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  ah(async (req, res) => {
    res.json(await buildMe(req.auth!.userId, req.auth!.permissions));
  }),
);

authRouter.post(
  "/change-password",
  requireAuth,
  ah(async (req, res) => {
    const body = parse(z.object({ currentPassword: z.string().min(1), newPassword: passwordSchema }), req.body);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.userId } });
    if (!user.passwordHash || !(await bcrypt.compare(body.currentPassword, user.passwordHash))) {
      throw badRequest("Current password is incorrect");
    }
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(body.newPassword) } }),
      // Sign out every other device.
      prisma.session.updateMany({
        where: { userId: user.id, revokedAt: null, id: { not: req.auth!.sessionId } },
        data: { revokedAt: new Date() },
      }),
    ]);
    invalidate(TAGS.user(user.id));
    await audit(req, "auth.password_changed", "User", user.id);
    res.json({ ok: true });
  }),
);

/** Issues a 6-digit reset/activation code. Delivery is via email once an email provider is configured. */
export async function issueResetCode(userId: string, email: string) {
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  await prisma.passwordReset.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } });
  await prisma.passwordReset.create({
    data: { userId, codeHash: sha256(code), expiresAt: new Date(Date.now() + RESET_CODE_TTL_MIN * 60_000) },
  });
  // TODO(email): send via the company email provider. Until then the code is printed to the server log.
  console.info(`[auth] Password reset code for ${email}: ${code} (valid ${RESET_CODE_TTL_MIN} min)`);
  return code;
}

async function findValidReset(email: string, code: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status === "DEACTIVATED" || user.status === "SUSPENDED") return null;
  const reset = await prisma.passwordReset.findFirst({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!reset || reset.attempts >= RESET_MAX_ATTEMPTS) return null;
  if (reset.codeHash !== sha256(code)) {
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { attempts: { increment: 1 } } });
    return null;
  }
  return { user, reset };
}

authRouter.post(
  "/forgot-password",
  resetLimiter,
  ah(async (req, res) => {
    const { email } = parse(z.object({ email: z.string().email() }), req.body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user && (user.status === "ACTIVE" || user.status === "INVITED")) {
      await issueResetCode(user.id, user.email);
      await audit(req, "auth.password_reset_requested", "User", user.id, undefined, user.id);
    }
    // Same response either way so the endpoint can't be used to discover accounts.
    res.json({ ok: true, message: "If the account exists, a reset code has been sent." });
  }),
);

const codeSchema = z.string().regex(/^\d{6}$/, "Code must be 6 digits");

authRouter.post(
  "/verify-reset-code",
  resetLimiter,
  ah(async (req, res) => {
    const body = parse(z.object({ email: z.string().email(), code: codeSchema }), req.body);
    if (!(await findValidReset(body.email, body.code))) throw badRequest("Invalid or expired code");
    res.json({ ok: true });
  }),
);

authRouter.post(
  "/reset-password",
  resetLimiter,
  ah(async (req, res) => {
    const body = parse(z.object({ email: z.string().email(), code: codeSchema, password: passwordSchema }), req.body);
    const found = await findValidReset(body.email, body.code);
    if (!found) throw badRequest("Invalid or expired code");
    const { user, reset } = found;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        // Setting a password activates invited accounts (onboarding step 4).
        data: { passwordHash: await hashPassword(body.password), status: user.status === "INVITED" ? "ACTIVE" : user.status },
      }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
      prisma.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    invalidate(TAGS.user(user.id));
    await audit(req, user.status === "INVITED" ? "auth.account_activated" : "auth.password_reset", "User", user.id, undefined, user.id);
    res.json({ ok: true });
  }),
);
