import AuthenticationService from "../../application/security/authenticationService.js";

export default async function authenticate(req, res, next) {
  try {
    const { user, auth } = await AuthenticationService.authenticateBearerHeader(
      req.get("authorization"),
    );
    req.user = user;
    req.auth = auth;
    return next();
  } catch (err) {
    return next(err);
  }
}
