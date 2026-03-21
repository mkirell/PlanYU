import AuthorizationService from "../../application/security/authorizationService.js";

export default function authorize(...requiredPermissions) {
  return async function (req, res, next) {
    try {
      await AuthorizationService.assertAuthorized({
        requiredPermissions,
        auth: req.auth || { roles: [], permissions: [] },
      });
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
