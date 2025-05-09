import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  getMySubmissionsByProblemId,
  getSubmissions,
  getSubmissionsCount,
} from "../controllers/submission";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.get("/", asHandler(authMiddleware), asHandler(getSubmissions));
router.get(
  "/:id",
  asHandler(authMiddleware),
  asHandler(getMySubmissionsByProblemId),
);
router.get(
  "/count/:id",
  asHandler(authMiddleware),
  asHandler(getSubmissionsCount),
);

export default router;
