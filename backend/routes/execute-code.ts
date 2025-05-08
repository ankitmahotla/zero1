import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import { executeCode } from "../controllers/execute-code";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.post("/", asHandler(authMiddleware), asHandler(executeCode));

export default router;
