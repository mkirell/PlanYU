import { BaseError } from "../../shared/errors/appError.js";

export default function errorHandler(err, req, res, next) {
  if (err instanceof BaseError) {
    let details = err.details ? err.details : undefined;
    if (err.code === "VALIDATION_ERROR" && Array.isArray(err.details)) {
      details = err.details.map((d) => {
        if (!d) return String(d);
        if (typeof d === "string") return d;
        if (typeof d === "object" && "message" in d) return d.message;
        return JSON.stringify(d);
      });
    }

    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: details,
      },
    });
  }

  if (err && err.name && err.name.startsWith("Sequelize")) {
    const details = err.errors
      ? err.errors.map((e) => e.message)
      : err.fields
        ? err.fields
        : undefined;

    const conflictErrors = new Set([
      "SequelizeUniqueConstraintError",
      "SequelizeForeignKeyConstraintError",
      "SequelizeExclusionConstraintError",
    ]);

    const status = conflictErrors.has(err.name) ? 409 : 400;

    return res
      .status(status)
      .json({ error: { code: err.name, message: err.message, details } });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
}
