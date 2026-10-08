import crypto from "node:crypto";
import { env } from "../config/env.js";

/**
 * Real-time push over Supabase Realtime Broadcast.
 *
 * Security model: the app uses its own auth (not Supabase Auth), so each user listens on an
 * unguessable per-user topic derived with an HMAC of a server secret, handed out only to the
 * authenticated user. Events carry *signals only* (ids, kinds) — never message text or HR data —
 * and the browser fetches the real data through the authenticated API. A leaked or spoofed
 * topic therefore can't expose data or inject content.
 */

const publishKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_ANON_KEY;
export const realtimeEnabled = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && publishKey);

const topicSecret = crypto.createHash("sha256").update(`realtime-topic:${env.JWT_ACCESS_SECRET}`).digest();

export const userTopic = (userId: string) =>
  `u_${crypto.createHmac("sha256", topicSecret).update(userId).digest("base64url").slice(0, 32)}`;

export type RealtimeEvent =
  | { event: "notification"; payload: { type: string } }
  | { event: "chat"; payload: { kind: "message" | "edit" | "delete" | "read" | "typing" | "conversation"; conversationId: string; messageId?: string; userId?: string } };

/** Fire-and-forget broadcast to each user's private topic. Failures are logged, never thrown. */
export function publish(userIds: string[], ev: RealtimeEvent) {
  if (!realtimeEnabled || !userIds.length) return;
  const messages = [...new Set(userIds)].map((u) => ({ topic: userTopic(u), event: ev.event, payload: ev.payload }));
  fetch(`${env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: publishKey!, Authorization: `Bearer ${publishKey}` },
    body: JSON.stringify({ messages }),
    signal: AbortSignal.timeout(5000),
  })
    .then(async (r) => {
      if (!r.ok) console.warn(`[realtime] broadcast failed ${r.status}: ${(await r.text()).slice(0, 200)}`);
    })
    .catch((e) => console.warn("[realtime] broadcast error:", e.message));
}

/** Connection details for the signed-in user's browser. */
export const realtimeConfig = (userId: string) =>
  realtimeEnabled
    ? { enabled: true, url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY, topic: userTopic(userId) }
    : { enabled: false };
