import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/utils/errors.js";
import UserRepository from "../../infrastructure/repositories/userRepository.js";

export default async function authenticate(req, res, next) {
  try {
    const hdr = req.get("authorization") || "";
    const parts = hdr.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return next(new UnauthorizedError());
    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserRepository.findById(payload.sub);
    const tokenVersion = payload.tokenVersion ?? null;
    if (tokenVersion === null || tokenVersion !== (user.token_version ?? 0)) {
      res.clearCookie("session", { path: "/api/auth" });
      return next(new UnauthorizedError());
    }
    req.user = { user_id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    if (err && err.name === "TokenExpiredError")
      return next(new UnauthorizedError("Access token expired"));
    return next(new UnauthorizedError());
  }
}
