import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getPlaylists } from "../controllers/playlist";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.get("/", asHandler(authMiddleware), asHandler(getPlaylists));

export default router;
