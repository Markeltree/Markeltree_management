import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();
// Open the pool up front so the first request doesn't pay for connection setup.
prisma.$connect().catch((e) => console.error("[server] database connection failed", e));
const server = app.listen(env.PORT, () => {
  console.info(`[server] API listening on http://localhost:${env.PORT}/api (${env.NODE_ENV})`);
});

async function shutdown(signal: string) {
  console.info(`[server] ${signal} received, shutting down`);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
