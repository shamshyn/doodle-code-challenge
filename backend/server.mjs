import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT ?? "3000");
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "super-secret-doodle-token";

const json = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

/** @type {Array<{id: string, message: string, author: string, timestamp: string}>} */
const messages = [
  {
    id: randomUUID(),
    message: "Welcome to Doodle chat.",
    author: "System",
    timestamp: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: randomUUID(),
    message: "Backend is running.",
    author: "System",
    timestamp: new Date(Date.now() - 30_000).toISOString(),
  },
].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const isAuthorized = (req) => {
  const auth = req.headers.authorization ?? "";
  return auth === `Bearer ${AUTH_TOKEN}`;
};

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    json(res, 400, { error: "Bad Request" });
    return;
  }

  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (!isAuthorized(req)) {
    json(res, 401, { error: "Unauthorized" });
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/api/v1/messages") {
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const before = url.searchParams.get("before");

    const startIndex = before ? messages.findIndex((m) => m.id === before) + 1 : 0;
    const safeStartIndex = Math.max(0, startIndex);
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const page = messages.slice(safeStartIndex, safeStartIndex + safeLimit);
    const hasMore = safeStartIndex + safeLimit < messages.length;

    json(res, 200, {
      messages: page,
      previousCursor: hasMore ? page[page.length - 1]?.id : undefined,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/v1/messages") {
    try {
      const body = await parseBody(req);
      const message = typeof body.message === "string" ? body.message.trim() : "";
      const author = typeof body.author === "string" ? body.author.trim() : "";

      if (!message || !author) {
        json(res, 400, { error: "message and author are required" });
        return;
      }

      const nextMessage = {
        id: randomUUID(),
        message,
        author,
        timestamp: new Date().toISOString(),
      };

      messages.unshift(nextMessage);
      json(res, 201, { message: nextMessage });
      return;
    } catch {
      json(res, 400, { error: "Invalid JSON body" });
      return;
    }
  }

  json(res, 404, { error: "Not Found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`doodle-backend listening on :${PORT}`);
});
