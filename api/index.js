// Vercel serverless entry: the Express API from server/ (compiled to server/dist during the build),
// served under /api on the same domain as the frontend so the httpOnly refresh cookie keeps working.
import { createApp } from "../server/dist/app.js";

export default createApp();
