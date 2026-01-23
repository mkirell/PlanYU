import logger from "../../shared/utils/loggerService.js";
import crypto from "crypto";

export default function httpLogger(req, res, next) {
  res.locals = res.locals || {};
  res.locals._start = Date.now();
  res.locals._reqId =
    res.locals._reqId ||
    req.headers["x-request-id"] ||
    crypto.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const ip =
    req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || "-";
  const reqId = res.locals._reqId;

  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl || req.url,
    params: req.params,
    query: req.query,
    ip,
    req_id: reqId,
  });

  res.on("finish", () => {
    if (res.locals && res.locals._errorLogged) return;
    const duration =
      res.locals && res.locals._start
        ? `${Date.now() - res.locals._start}ms`
        : "-";
    logger.info("Request completed", {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration,
      ip,
      req_id: reqId,
    });
  });

  next();
}
