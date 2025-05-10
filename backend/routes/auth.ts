import { Router } from "express";
import type { RequestHandler } from "express";
import {
  login,
  logout,
  me,
  refreshTokens,
  register,
} from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.post("/register", asHandler(register));
router.post("/login", asHandler(login));
router.post("/logout", asHandler(authMiddleware), asHandler(logout));
router.post(
  "/refresh-tokens",
  asHandler(authMiddleware),
  asHandler(refreshTokens),
);
router.get("/me", asHandler(authMiddleware), asHandler(me));

export default router;
