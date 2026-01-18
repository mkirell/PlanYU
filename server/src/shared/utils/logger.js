const SKIP_CALLERS = ["httpLogger.js"];
const MINIMAL = process.env.LOG_MINIMAL === "true";
const COLORS = { info: "\u001b[32m", warn: "\u001b[33m", error: "\u001b[31m" };

const normalizeIp = (ip) =>
  ip === "::1"
    ? "127.0.0.1"
    : ip?.startsWith("::ffff:")
      ? ip.split(":").pop()
      : ip || "-";

const extractStatus = (meta, msg) =>
  Number(meta?.status ?? meta?.statusCode ?? meta?.response?.status) ||
  Number(
    msg?.match(/status=(\d{3})/)?.[1] ||
      msg?.match(/"status"\s*:\s*(\d{3})/)?.[1],
  );

const parseStack = (stack) => {
  if (!stack) return;

  for (const line of stack.split("\n").slice(1)) {
    const t = line.trim();
    if (!t || t.includes("(internal") || t.includes("node:internal")) continue;

    const match =
      t.match(/\((.*):(\d+):\d+\)$/) || t.match(/at (.*):(\d+):\d+$/);
    if (!match) continue;

    const file = match[1];
    if (file.startsWith("node:") || file.includes("node_modules")) continue;

    const base = file.split("/").pop();
    if (SKIP_CALLERS.some((c) => base.endsWith(c))) continue;

    return { base, lineNo: match[2], file };
  }
};

const getCaller = () => parseStack(new Error().stack);

const formatEntry = (level, msg, meta) => {
  const status = extractStatus(
    meta,
    typeof msg === "string" ? msg : JSON.stringify(msg),
  );
  const action =
    `${meta?.method ?? meta?.reqMethod ?? ""} ${meta?.url ?? meta?.reqUrl ?? ""}`.trim();

  const parts = [
    new Date().toISOString(),
    level.toUpperCase(),
    status ? String(status) : "-",
    action || (typeof msg === "string" ? msg : JSON.stringify(msg)),
    meta?.duration ?? "-",
    normalizeIp(meta?.ip ?? meta?.remoteAddress),
  ];

  if (meta?.user_id ?? meta?.userId)
    parts.push(`user_id=${meta.user_id ?? meta.userId}`);
  if (meta?.req_id) parts.push(`req_id=${meta.req_id}`);

  const errMsg =
    meta?.err?.message ??
    (meta?.err
      ? String(meta.err)
      : msg instanceof Error
        ? msg.message
        : undefined);
  if (errMsg) parts.push(`err=${JSON.stringify(errMsg)}`);

  return parts.join(" │ ");
};

const write = (level, msg, meta) => {
  try {
    const caller = msg instanceof Error ? parseStack(msg.stack) : getCaller();
    const status = extractStatus(meta, msg);

    level = status >= 400 ? "error" : status >= 300 ? "warn" : "info";

    if (
      MINIMAL &&
      level !== "error" &&
      caller?.base &&
      SKIP_CALLERS.some((c) => caller.base.endsWith(c))
    )
      return;

    const line = formatEntry(level, msg, meta);

    const colored = `${COLORS[level] || COLORS.info}${line}\u001b[0m`;
    level === "error"
      ? console.error(colored)
      : level === "warn"
        ? console.warn(colored)
        : console.log(colored);
  } catch (e) {
    console.error("Logger unexpected error:", e);
  }
};

export default {
  info: (m, meta) => write("info", m, meta),
  warn: (m, meta) => write("warn", m, meta),
  error: (m, meta) => write("error", m, meta),
};
