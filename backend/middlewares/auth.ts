import jwt from "jsonwebtoken";
import type { RequestHandler } from "../controllers/auth";
import { db } from "../libs/db";

interface JwtPayload {
  id: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (e) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("Error authenticating user:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
