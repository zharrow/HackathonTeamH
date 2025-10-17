import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);

// Force Node.js runtime (Prisma requires Node.js APIs)
export const runtime = "nodejs";
