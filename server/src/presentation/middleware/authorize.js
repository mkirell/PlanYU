import { UnauthorizedError } from "../../shared/utils/errors.js";

export default function authorize(...allowedRoles) {
  return function (req, res, next) {
    const user = req.user || {};
    if (!allowedRoles || allowedRoles.length === 0) {
      if (!user.user_id) return next(new UnauthorizedError());
      return next();
    }
    if (!user.role || !allowedRoles.includes(user.role))
      return next(new UnauthorizedError());
    return next();
  };
}
