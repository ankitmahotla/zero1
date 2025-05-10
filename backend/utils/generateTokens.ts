import jwt from "jsonwebtoken";

export function generateTokens(payload: object) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
  const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return { accessToken, refreshToken, refreshTokenExpiry };
}
