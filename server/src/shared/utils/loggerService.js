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
    const status = extractStatus(meta, msg);
    if (Number.isFinite(status)) {
      level = status >= 400 ? "error" : status >= 300 ? "warn" : "info";
    }
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
