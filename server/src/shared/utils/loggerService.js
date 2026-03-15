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
  const method = meta?.method ?? meta?.reqMethod;
  const path = meta?.url ?? meta?.reqUrl;
  const corr = meta?.correlation_id ?? meta?.correlationId;

  if (method || path) {
    const hasStatus = Number.isFinite(status) && status > 0;
    const parts = [
      `timestamp=${new Date().toISOString()}`,
      `level=${level.toUpperCase()}`,
      `status=${hasStatus ? String(status) : "-"}`,
      `method=${method ?? "-"}`,
      `path=${path ?? "-"}`,
      `time=${hasStatus ? (meta?.duration ?? "-") : "-"}`,
      `ip=${normalizeIp(meta?.ip ?? meta?.remoteAddress)}`,
      `correlation_id=${corr ?? "-"}`,
    ];

    if (meta?.user_id ?? meta?.userId) {
      parts.push(`user_id=${meta.user_id ?? meta.userId}`);
    }

    return parts.join(" │ ");
  }

  const parts = [
    `timestamp=${new Date().toISOString()}`,
    `level=${level.toUpperCase()}`,
    `message=${typeof msg === "string" ? msg : JSON.stringify(msg)}`,
  ];

  if (Number.isFinite(status) && status > 0) {
    parts.push(`status=${status}`);
  }
  if (meta?.duration) {
    parts.push(`time=${meta.duration}`);
  }
  if (meta?.ip ?? meta?.remoteAddress) {
    parts.push(`ip=${normalizeIp(meta?.ip ?? meta?.remoteAddress)}`);
  }
  if (meta?.user_id ?? meta?.userId) {
    parts.push(`user_id=${meta.user_id ?? meta.userId}`);
  }
  if (corr) {
    parts.push(`correlation_id=${corr}`);
  }

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
