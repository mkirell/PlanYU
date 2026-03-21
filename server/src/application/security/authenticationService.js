import UserRepository from "../../infrastructure/repositories/userRepository.js";
import { UnauthorizedError } from "../../shared/errors/appError.js";
import { verifyAccessToken } from "./tokenSecurityService.js";
import AuthorizationService from "./authorizationService.js";

const AuthenticationService = {
  async authenticateBearerHeader(authorizationHeader) {
    const header = authorizationHeader || "";
    const parts = header.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError();
    }

    try {
      const payload = verifyAccessToken(parts[1]);
      const user = await UserRepository.findById(payload.sub);
      if (!user || !user.verified_at) {
        throw new UnauthorizedError();
      }

      const auth = await AuthorizationService.buildAuthContext(user);

      return {
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
        },
        auth,
      };
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        throw new UnauthorizedError("Access token expired");
      }
      throw new UnauthorizedError();
    }
  },
};

export default AuthenticationService;