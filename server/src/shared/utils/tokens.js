import jwt from "jsonwebtoken";

const signTokens = (user) => {
  const tokenVersion = user.token_version ?? 0;
  const subject = String(user.user_id ?? user.id ?? "");
  const accessToken = jwt.sign(
    { email: user.email, tokenVersion, role: user.role ?? "GUEST" },
    process.env.JWT_SECRET,
    { subject, expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { email: user.email, tokenVersion, role: user.role ?? "GUEST" },
    process.env.JWT_SECRET,
    { subject, expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

export default signTokens;
